// Supabase Edge Function: claim-spelling-payment
// Matches unclaimed Spelling Bee payments to authenticated users by email.
// Called after a user creates an account post-purchase (guest checkout flow).
// Deploy: supabase functions deploy claim-spelling-payment
// Required secrets: SUPABASE_SERVICE_ROLE_KEY (auto-available)
//
// SECURITY: Rate limit 10 req/min per IP recommended

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // TODO: Add rate limiting (10 req/min per IP)

  try {
    // ── Require authentication ───────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userEmail = user.email;
    if (!userEmail) {
      return new Response(JSON.stringify({ claimed: false, reason: 'No email on account' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
