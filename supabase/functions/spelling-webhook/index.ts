// Supabase Edge Function: spelling-webhook
// Handles LemonSqueezy webhook events for ATQ Spelling Bee payments.
// Listens for `order_created` events.
// Deploy: supabase functions deploy spelling-webhook --no-verify-jwt
// Required secrets: LEMONSQUEEZY_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY
//
// TODO: Implement HMAC-SHA256 verification with LEMONSQUEEZY_WEBHOOK_SECRET
// SECURITY: Rate limit 100 req/min per IP recommended

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

  try {
    // ── Verify webhook signature ─────────────────────────────────
    const signature = req.headers.get('X-Signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Implement proper HMAC-SHA256 verification
    // const webhookSecret = Deno.env.get('LEMONSQUEEZY_WEBHOOK_SECRET')!;
    // const rawBody = await req.text();
    // const encoder = new TextEncoder();
    // const key = await crypto.subtle.importKey(
    //   'raw', encoder.encode(webhookSecret),
    //   { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    // );
    // const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    // const expectedHex = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
    // if (expectedHex !== signature) { return 401; }

    const body = await req.json();
    const eventName = body?.meta?.event_name;

    if (eventName !== 'order_created') {
      // Acknowledge but ignore non-order events
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Extract order data ───────────────────────────────────────
    const customData = body?.meta?.custom_data ?? {};
    const parentId = customData.parent_id || null;
    const customerEmail = customData.customer_email || body?.data?.attributes?.user_email || null;
    const orderId = String(body?.data?.id ?? '');

    // TODO: Create Supabase admin client with service role key
    // const supabaseAdmin = createClient(
    //   Deno.env.get('SUPABASE_URL')!,
    //   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    // );

    // TODO: Record payment in spelling_payments table
    // await supabaseAdmin.from('spelling_payments').upsert({
    //   lemonsqueezy_order_id: orderId,
    //   parent_id: parentId,
    //   customer_email: customerEmail,
    //   status: 'completed',
    //   completed_at: new Date().toISOString(),
    // });

    // TODO: Mark child profile as paid for spelling
    // if (parentId) {
    //   await supabaseAdmin.from('child_profiles')
    //     .update({ has_paid_spelling: true })
    //     .eq('parent_id', parentId);
    // }

    // TODO: Send welcome email via Resend (fire-and-forget)
    // try {
    //   const resendKey = Deno.env.get('RESEND_API_KEY');
    //   if (resendKey && customerEmail) {
    //     await fetch('https://api.resend.com/emails', { ... });
    //   }
    // } catch (emailErr) {
    //   console.error('Email send failed (non-fatal):', emailErr);
    // }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook error:', message);
    // Always return 200 to avoid LemonSqueezy retries on app errors
    return new Response(JSON.stringify({ error: message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
