// Supabase Edge Function: claim-spelling-payment
// Matches unclaimed Spelling Bees payments to authenticated users by email.
// Called after a user creates an account post-purchase (guest checkout flow).
// Also re-applies has_paid_spelling if payment was claimed before child profiles existed.
// Deploy: supabase functions deploy claim-spelling-payment
// Required secrets: SUPABASE_SERVICE_ROLE_KEY (auto-available)
//
// SECURITY: In-memory rate limiting (10 req/min per IP) + requires auth

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PROD_ORIGINS = [
  'https://answerthequestion.co.uk',
  'https://www.answerthequestion.co.uk',
  'https://spelling.answerthequestion.co.uk',
  'https://spellingbees.co.uk',
  'https://www.spellingbees.co.uk',
];

function isTrustedOrigin(origin: string): boolean {
  if (PROD_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true;
  if (
    Deno.env.get('ALLOW_LOCALHOST') === 'true' &&
    /^http:\/\/localhost(:\d+)?$/.test(origin)
  ) return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') ?? '';
  const allowedOrigin = isTrustedOrigin(origin) ? origin : PROD_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(clientIp, 10, 60_000);
  if (!rateLimitResult.allowed) {
    const retryAfterSec = Math.ceil(rateLimitResult.retryAfterMs! / 1000);
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: {
        ...getCorsHeaders(req),
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSec),
      },
    });
  }

  try {
    // ── Require authentication ───────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const userEmail = user.email;
    if (!userEmail) {
      return new Response(JSON.stringify({ claimed: false, reason: 'No email on account' }), {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // ── Use service role key to bypass RLS ────────────────────────
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // ── Look up unclaimed payments by email ───────────────────────
    const { data: unclaimedPayments, error: lookupError } = await supabaseAdmin
      .from('spelling_payments')
      .select('id')
      .eq('customer_email', userEmail.toLowerCase())
      .eq('status', 'completed')
      .is('parent_id', null);

    if (lookupError) {
      console.error('Failed to look up spelling payments:', lookupError.message);
    }

    if (unclaimedPayments && unclaimedPayments.length > 0) {
      // ── Claim unclaimed payments ─────────────────────────────────
      const ids = unclaimedPayments.map(p => p.id);
      const { error: claimError } = await supabaseAdmin
        .from('spelling_payments')
        .update({ parent_id: user.id })
        .in('id', ids);

      if (claimError) {
        console.error('Failed to claim spelling payments:', claimError.message);
      } else {
        console.log(`Claimed ${ids.length} spelling payment(s) for ${userEmail}`);
      }

      // Mark all child profiles as paid for spelling
      const { error: updateError } = await supabaseAdmin
        .from('child_profiles')
        .update({ has_paid_spelling: true })
        .eq('parent_id', user.id);

      if (updateError) {
        console.error('Failed to mark children paid for spelling:', updateError.message);
      }

      return new Response(JSON.stringify({ claimed: true, count: ids.length }), {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // ── No unclaimed payments — check if already claimed ──────────
    // This handles the case where payment was claimed before child profiles
    // were created (e.g. user paid, then created account, then added child).
    const { data: claimedPayments } = await supabaseAdmin
      .from('spelling_payments')
      .select('id')
      .eq('parent_id', user.id)
      .eq('status', 'completed')
      .limit(1);

    if (claimedPayments && claimedPayments.length > 0) {
      // Re-apply has_paid_spelling (covers new child profiles added after payment)
      await supabaseAdmin
        .from('child_profiles')
        .update({ has_paid_spelling: true })
        .eq('parent_id', user.id);

      return new Response(JSON.stringify({ claimed: true, count: 0, alreadyClaimed: true }), {
        status: 200,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ claimed: false }), {
      status: 200,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
