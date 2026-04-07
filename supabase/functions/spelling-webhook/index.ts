// Supabase Edge Function: spelling-webhook
// Handles LemonSqueezy webhook events for Spelling Bees payments.
// Listens for `order_created` events, records payment, marks child profiles paid,
// and sends a welcome email via Resend (fire-and-forget).
// Deploy: supabase functions deploy spelling-webhook --no-verify-jwt
// Required secrets: SPELLING_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY
//
// SECURITY: HMAC-SHA256 signature verification + rate limiting (100 req/min per IP)

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ─── Welcome Email HTML ─────────────────────────────────────────

const WELCOME_EMAIL_HTML = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#fffbeb;font-family:'Nunito',system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:48px;">🐝</span>
      <span style="font-size:24px;position:relative;top:-20px;left:-8px;">👑</span>
    </div>
    <h1 style="text-align:center;color:#92400e;font-size:24px;margin-bottom:8px;">
      Welcome to Spelling Bees!
    </h1>
    <p style="text-align:center;color:#78716c;font-size:15px;margin-bottom:28px;">
      Thank you for your purchase. Your child now has full access to all 624 spelling words.
    </p>
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #fde68a;margin-bottom:24px;">
      <h2 style="color:#d97706;font-size:16px;margin:0 0 12px 0;">Getting started</h2>
      <ol style="color:#44403c;font-size:14px;line-height:1.8;padding-left:20px;margin:0;">
        <li>Sign in at <a href="https://spellingbees.co.uk" style="color:#d97706;font-weight:bold;">spellingbees.co.uk</a></li>
        <li>Create a player profile for your child</li>
        <li>Start with the first session &mdash; just 5&ndash;10 minutes a day</li>
      </ol>
    </div>
    <div style="background:#fffbeb;border-radius:12px;padding:20px;border:1px solid #fde68a;margin-bottom:24px;">
      <p style="color:#92400e;font-size:14px;font-weight:bold;margin:0 0 8px 0;text-align:center;">
        Five words a day, five days a week
      </p>
      <p style="color:#78716c;font-size:13px;text-align:center;margin:0;">
        Spaced repetition means your child revisits tricky words at just the right time.
        All 624 words covered in about six months.
      </p>
    </div>
    <hr style="border:none;border-top:1px solid #fde68a;margin:24px 0;" />
    <p style="color:#a8a29e;font-size:11px;text-align:center;">
      Spelling Bees &mdash; spellingbees.co.uk &mdash; Part of the Tweenage family
    </p>
  </div>
</body>
</html>
`;

// ─── HMAC-SHA256 Verification ───────────────────────────────────

async function verifySignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const expectedHex = [...new Uint8Array(sig)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return expectedHex === signature;
}

// ─── Resend Helper ──────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.error('RESEND_API_KEY not set — skipping email');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Spelling Bees <hello@spellingbees.co.uk>',
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error ${res.status}: ${text}`);
  }

  console.log(`Email sent: "${subject}" to ${to}`);
}

// ─── Main Handler ───────────────────────────────────────────────

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

  // Rate limiting
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(clientIp, 100, 60_000);
  if (!rateLimitResult.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
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

    const webhookSecret = Deno.env.get('SPELLING_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('SPELLING_WEBHOOK_SECRET not set');
      return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rawBody = await req.text();
    const isValid = await verifySignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = JSON.parse(rawBody);
    const eventName = body?.meta?.event_name;

    if (eventName !== 'order_created') {
      // Acknowledge but ignore non-order events
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const orderStatus = body?.data?.attributes?.status;
    if (orderStatus !== 'paid') {
      console.log(`Order not paid (status: ${orderStatus}) — acknowledging`);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Extract order data ───────────────────────────────────────
    const customData = body?.meta?.custom_data ?? {};
    const parentId = customData.parent_id || null;
    const customerEmail = (
      customData.customer_email ||
      body?.data?.attributes?.user_email ||
      ''
    ).toLowerCase().trim();
    const orderId = String(body?.data?.id ?? '');

    console.log(`[spelling-webhook] order_created: orderId=${orderId}, parentId=${parentId}, email=${customerEmail}`);

    // ── Create Supabase admin client ─────────────────────────────
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // ── Record payment ───────────────────────────────────────────
    const { error: paymentError } = await supabaseAdmin
      .from('spelling_payments')
      .upsert({
        lemonsqueezy_order_id: orderId,
        parent_id: parentId,
        customer_email: customerEmail || null,
        status: 'completed',
        completed_at: new Date().toISOString(),
      }, { onConflict: 'lemonsqueezy_order_id' });

    if (paymentError) {
      console.error('Failed to record spelling payment:', paymentError.message);
    } else {
      console.log(`Spelling payment recorded: order ${orderId}`);
    }

    // ── Mark child profiles as paid ──────────────────────────────
    if (parentId) {
      const { error: updateError } = await supabaseAdmin
        .from('child_profiles')
        .update({ has_paid_spelling: true })
        .eq('parent_id', parentId);

      if (updateError) {
        console.error('Failed to mark child profiles paid:', updateError.message);
      } else {
        console.log(`Marked all children of ${parentId} as has_paid_spelling=true`);
      }
    }

    // ── Send welcome email (fire-and-forget) ─────────────────────
    // Return 200 to LemonSqueezy immediately, then send email in background
    const emailPromise = customerEmail
      ? sendEmail(
          customerEmail,
          'Welcome to Spelling Bees! 🐝',
          WELCOME_EMAIL_HTML,
        ).catch(err => {
          console.error('Welcome email failed (non-fatal):', err);
        })
      : Promise.resolve();

    try {
      // @ts-ignore — EdgeRuntime may not be typed
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(emailPromise);
      }
    } catch {
      // Swallow — worst case the email still fires
    }

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
