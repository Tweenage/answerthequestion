// Supabase Edge Function: claim-spelling-payment
// Matches unclaimed Spelling Bee payments to authenticated users by email.
// Called after a user creates an account post-purchase (guest checkout flow).
// Deploy: supabase functions deploy claim-spelling-payment
// Required secrets: SUPABASE_SERVICE_ROLE_KEY (auto-available)
//
// SECURITY: Rate limit 10 req/min per IP recommended

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PROD_ORIGINS = [
  'https://answerthequestion.co.uk',
  'https://www.answerthequestion.co.uk',
  'https://spelling.answerthequestion.co.uk',
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

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }

  // TODO: Add rate limiting (10 req/min per IP)

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

    // TODO: Look up unclaimed payments by email using service role key
    // const supabaseAdmin = createClient(
    //   supabaseUrl,
    //   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    // );
    //
    // const { data: payments } = await supabaseAdmin
    //   .from('spelling_payments')
    //   .select('*')
    //   .eq('customer_email', userEmail.toLowerCase())
    //   .eq('status', 'completed')
    //   .is('parent_id', null);
    //
    // if (!payments || payments.length === 0) {
    //   return new Response(JSON.stringify({ claimed: false }), { ... });
    // }
    //
    // // Claim the payment: attach parent_id
    // await supabaseAdmin.from('spelling_payments')
    //   .update({ parent_id: user.id })
    //   .eq('id', payments[0].id);
    //
    // // Mark child profiles as paid for spelling
    // await supabaseAdmin.from('child_profiles')
    //   .update({ has_paid_spelling: true })
    //   .eq('parent_id', user.id);

    // Stub: return success
    return new Response(JSON.stringify({ claimed: true }), {
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
