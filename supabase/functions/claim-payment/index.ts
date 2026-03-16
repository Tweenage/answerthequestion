// Supabase Edge Function: claim-payment
// Links a guest checkout payment to a newly created account.
// Called after signup + child creation to find unclaimed payments matching the
// user's email and mark their child profiles as paid.
// Deploy: supabase functions deploy claim-payment
// No extra secrets needed (uses built-in Supabase env vars).

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.ts';

const PROD_ORIGINS = [
  'https://answerthequestion.co.uk',
  'https://www.answerthequestion.co.uk',
];

const ALLOWED_ORIGINS = Deno.env.get('ALLOW_LOCALHOST') === 'true'
  ? [...PROD_ORIGINS, 'http://localhost:5173']
  : PROD_ORIGINS;

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') ?? '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  // Rate limit: 10 requests per minute per IP
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
    // Authentication is REQUIRED — user must be logged in to claim
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    if (!user.email) {
      return new Response(JSON.stringify({ claimed: false, reason: 'No email on account' }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Use service role to bypass RLS
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find completed payments matching this email that haven't been linked to an account
    const { data: payments, error: fetchError } = await supabaseAdmin
      .from('payments')
      .select('id, include_crib_sheet')
      .eq('customer_email', user.email.toLowerCase())
      .eq('status', 'completed')
      .is('parent_id', null);

    if (fetchError) {
      console.error('Error fetching unclaimed payments:', fetchError);
      return new Response(JSON.stringify({ error: 'Failed to check payments' }), {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    if (!payments || payments.length === 0) {
      return new Response(JSON.stringify({ claimed: false }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Link all unclaimed payments to this user
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({ parent_id: user.id })
      .eq('customer_email', user.email.toLowerCase())
      .eq('status', 'completed')
      .is('parent_id', null);

    if (updateError) {
      console.error('Error linking payments:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to link payments' }), {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Mark ALL child profiles for this parent as paid
    await supabaseAdmin
      .from('child_profiles')
      .update({ has_paid: true })
      .eq('parent_id', user.id);

    const hasCribSheet = payments.some(p => p.include_crib_sheet);
    console.log(`Claimed ${payments.length} payment(s) for user ${user.id} (${user.email}), crib_sheet=${hasCribSheet}`);

    return new Response(JSON.stringify({
      claimed: true,
      count: payments.length,
      includeCribSheet: hasCribSheet,
    }), {
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('claim-payment error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
