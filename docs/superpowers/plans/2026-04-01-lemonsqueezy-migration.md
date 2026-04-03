# LemonSqueezy Payment Migration Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Stripe payment stack with LemonSqueezy across all edge functions, frontend pages, CSP headers, and legal copy — preserving the guest checkout flow, crib sheet bump, discount code support, and fire-and-forget email pattern.

**Architecture:** A new `lemonsqueezy-webhook` edge function replaces `stripe-webhook`. The `create-checkout-session` function is rewritten to call the LemonSqueezy API instead of Stripe. The existing `claim-payment` function is unchanged (it matches by email, not by payment processor). The `payments` table gains a `lemonsqueezy_order_id` column; Stripe columns remain nullable for historical records.

**Tech Stack:** Supabase Edge Functions (Deno), LemonSqueezy REST API v1, Resend (email unchanged), React 19 / Vite 7, Tailwind CSS v4.

**Key constants:**
- Store ID: `935614`
- Main product Variant ID: `1470778` (£29.99)
- Crib sheet Variant ID: `1470852` (£4.99 — used only for labelling; pricing handled via `custom_price` override on variant 1470778)
- Secrets required: `LEMONSQUEEZY_API_KEY` (already set), `LEMONSQUEEZY_WEBHOOK_SECRET` (set after creating webhook endpoint in LemonSqueezy dashboard)

---

## Chunk 1: Database + Edge Functions

### Task 1: Add `lemonsqueezy_order_id` column to payments table

**Files:**
- Manual SQL — run in Supabase SQL editor

- [ ] **Step 1: Run migration SQL**

In Supabase dashboard → SQL editor, run:

```sql
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS lemonsqueezy_order_id TEXT;
```

- [ ] **Step 2: Verify column exists**

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payments'
  AND column_name = 'lemonsqueezy_order_id';
```

Expected: one row returned with `text`, `YES`.

---

### Task 2: Replace `create-checkout-session` with LemonSqueezy API

**Files:**
- Modify: `supabase/functions/create-checkout-session/index.ts`

- [ ] **Step 1: Rewrite the file**

Replace the entire file with:

```typescript
// Supabase Edge Function: create-checkout-session
// Creates a LemonSqueezy checkout for a one-time £29.99 payment.
// Optionally includes the CLEAR Method Crib Sheet (£4.99) via custom_price override.
// Supports both authenticated users and guest checkout (pay first, create account after).
// Deploy: supabase functions deploy create-checkout-session
// Required secrets: LEMONSQUEEZY_API_KEY
//
// SECURITY: In-memory rate limiting (10 req/min per IP) + external limits recommended.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const LS_STORE_ID = '935614';
const LS_VARIANT_ID = '1470778'; // £29.99 main product
const LS_API_URL = 'https://api.lemonsqueezy.com/v1/checkouts';

const PRICE_MAIN_PENCE = 2999;       // £29.99
const PRICE_WITH_CRIB_PENCE = 3498;  // £34.98 (£29.99 + £4.99)

const PROD_ORIGINS = [
  'https://answerthequestion.co.uk',
  'https://www.answerthequestion.co.uk',
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

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
    const apiKey = Deno.env.get('LEMONSQUEEZY_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Payment service not configured' }), {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // ── Authenticate (optional — guest checkout allowed) ──────────
    let userId: string | null = null;
    let customerEmail: string | null = null;

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!authError && user) {
        userId = user.id;
        customerEmail = user.email ?? null;
      }
    }

    const { successUrl, cancelUrl, includeCribSheet, email, discountCode } = await req.json();

    // Guest checkout requires email
    if (!userId) {
      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return new Response(JSON.stringify({ error: 'A valid email address is required for checkout' }), {
          status: 400,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }
      customerEmail = email.trim().toLowerCase();
    }

    // Validate redirect URLs
    const isAllowedUrl = (url: string) => {
      try { return isTrustedOrigin(new URL(url).origin); }
      catch { return false; }
    };
    if (!successUrl || !cancelUrl || !isAllowedUrl(successUrl) || !isAllowedUrl(cancelUrl)) {
      return new Response(JSON.stringify({ error: 'Invalid redirect URL' }), {
        status: 400,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const customPrice = includeCribSheet ? PRICE_WITH_CRIB_PENCE : PRICE_MAIN_PENCE;

    // Build the LemonSqueezy checkout redirect URL
    // Append ls=1 so the success page knows we came from a real payment
    const redirectUrl = `${successUrl}?ls=1${includeCribSheet ? '&crib_sheet=1' : ''}`;

    // ── Create LemonSqueezy checkout ──────────────────────────────
    const checkoutBody = {
      data: {
        type: 'checkouts',
        attributes: {
          custom_price: customPrice,
          product_options: {
            redirect_url: redirectUrl,
            receipt_button_text: 'Start Practising',
            receipt_link_url: successUrl,
            receipt_thank_you_note: 'Thank you! Check your email for your welcome message from Professor Hoot.',
          },
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
            desc: true,
            // If a discount code is pre-applied, hide the field to avoid confusion
            discount: !discountCode,
            dark: false,
          },
          checkout_data: {
            ...(customerEmail ? { email: customerEmail } : {}),
            ...(discountCode ? { discount_code: (discountCode as string).trim().toUpperCase() } : {}),
            custom: {
              parent_id: userId ?? '',
              include_crib_sheet: includeCribSheet ? 'true' : 'false',
              customer_email: customerEmail ?? '',
            },
          },
          test_mode: false,
        },
        relationships: {
          store: { data: { type: 'stores', id: LS_STORE_ID } },
          variant: { data: { type: 'variants', id: LS_VARIANT_ID } },
        },
      },
    };

    const lsResponse = await fetch(LS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(checkoutBody),
    });

    if (!lsResponse.ok) {
      const errText = await lsResponse.text();
      console.error(`LemonSqueezy API error ${lsResponse.status}: ${errText}`);
      return new Response(JSON.stringify({ error: 'Failed to create checkout. Please try again.' }), {
        status: 502,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const lsData = await lsResponse.json();
    const checkoutUrl = lsData?.data?.attributes?.url;

    if (!checkoutUrl) {
      console.error('No checkout URL in LemonSqueezy response:', JSON.stringify(lsData));
      return new Response(JSON.stringify({ error: 'No checkout URL returned' }), {
        status: 502,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // ── Record pending payment in DB ──────────────────────────────
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabaseAdmin.from('payments').insert({
      ...(userId ? { parent_id: userId } : {}),
      customer_email: customerEmail,
      status: 'pending',
      include_crib_sheet: !!includeCribSheet,
      currency: 'gbp',
    });

    return new Response(JSON.stringify({ url: checkoutUrl }), {
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
```

- [ ] **Step 2: Deploy**

```bash
supabase functions deploy create-checkout-session
```

Expected: "Deployed Edge Function create-checkout-session"

---

### Task 3: Create `lemonsqueezy-webhook` edge function

**Files:**
- Create: `supabase/functions/lemonsqueezy-webhook/index.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p "/Users/rebeccaeverton/11+ Read the Question/supabase/functions/lemonsqueezy-webhook"
```

- [ ] **Step 2: Write the file**

```typescript
// Supabase Edge Function: lemonsqueezy-webhook
// Handles LemonSqueezy webhook events (order_created).
// Sends payment confirmation + optional crib sheet email via Resend.
// Deploy: supabase functions deploy lemonsqueezy-webhook --no-verify-jwt
// Required secrets: LEMONSQUEEZY_WEBHOOK_SECRET, RESEND_API_KEY
//
// SECURITY: In-memory rate limiting (100 req/min per IP) + LemonSqueezy signature verification.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EMAIL_FROM = 'AnswerTheQuestion! <hello@answerthequestion.co.uk>';

// ─── Resend Helper ───────────────────────────────────────────────

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Uint8Array; contentType: string }>;
}): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.error('RESEND_API_KEY not set — skipping email');
    return;
  }

  const body: Record<string, unknown> = {
    from: EMAIL_FROM,
    to: [options.to],
    subject: options.subject,
    html: options.html,
  };

  if (options.attachments?.length) {
    body.attachments = options.attachments.map(a => ({
      filename: a.filename,
      content: encodeBase64(a.content),
    }));
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error ${res.status}: ${text}`);
  }

  console.log(`Email sent: "${options.subject}"`);
}

// ─── Email Templates (copied from stripe-webhook) ────────────────

const PAYMENT_CONFIRMATION_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Nunito',Arial,sans-serif;background-color:#f3e8ff;color:#1f2937;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <p style="font-size:48px;margin:0;">🦉</p>
      <h1 style="font-size:24px;font-weight:800;color:#7c3aed;margin:8px 0 4px;">
        Payment Confirmed!
      </h1>
      <p style="font-size:14px;color:#6b7280;margin:0;">
        From Professor Hoot at AnswerTheQuestion!
      </p>
    </div>
    <div style="background:white;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
        Thank you for your purchase! 🎉
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
        You now have <strong>full access</strong> to the AnswerTheQuestion! 11+ exam technique
        training programme. Your child can start practising straight away.
      </p>
      <div style="background:#faf5ff;border-radius:12px;padding:16px;margin:0 0 16px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#7c3aed;">What&rsquo;s included:</p>
        <p style="margin:0 0 4px;font-size:14px;">&#10003; 12-week exam technique training programme</p>
        <p style="margin:0 0 4px;font-size:14px;">&#10003; The CLEAR Method &mdash; a step-by-step exam strategy</p>
        <p style="margin:0 0 4px;font-size:14px;">&#10003; Hundreds of practice questions across all subjects</p>
        <p style="margin:0;font-size:14px;">&#10003; Progress tracking and performance insights</p>
      </div>
      <div style="text-align:center;margin:20px 0;">
        <a href="https://answerthequestion.co.uk/login" style="display:inline-block;padding:14px 28px;background:linear-gradient(to right,#7c3aed,#c026d3);color:white;font-weight:700;font-size:16px;text-decoration:none;border-radius:12px;">
          Start Practising &rarr;
        </a>
      </div>
      <p style="font-size:15px;line-height:1.6;margin:0 0 4px;">
        Good luck with the preparation &mdash; you&rsquo;ve got this! 💪
      </p>
      <p style="font-size:15px;font-weight:700;color:#7c3aed;margin:0;">
        &mdash; Professor Hoot 🦉
      </p>
    </div>
    <div style="text-align:center;margin-top:24px;font-size:12px;color:#9ca3af;">
      <p style="margin:0 0 4px;">AnswerTheQuestion! &mdash; 11+ Exam Technique Training</p>
      <p style="margin:0;">
        <a href="https://answerthequestion.co.uk" style="color:#7c3aed;text-decoration:none;">answerthequestion.co.uk</a>
      </p>
    </div>
  </div>
</body>
</html>`;

const CRIB_SHEET_EMAIL_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Nunito',Arial,sans-serif;background-color:#f3e8ff;color:#1f2937;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <p style="font-size:48px;margin:0;">🦉</p>
      <h1 style="font-size:24px;font-weight:800;color:#7c3aed;margin:8px 0 4px;">
        Your Crib Sheet is here!
      </h1>
      <p style="font-size:14px;color:#6b7280;margin:0;">
        From Professor Hoot at AnswerTheQuestion!
      </p>
    </div>
    <div style="background:white;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
        Brilliant &mdash; you&rsquo;ve taken a great step! 🎉
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
        Attached is your <strong>CLEAR Method Crib Sheet</strong> &mdash; a printable
        one-pager with the five steps your child can follow in any exam:
      </p>
      <div style="background:#faf5ff;border-radius:12px;padding:16px;margin:0 0 16px;">
        <p style="margin:0 0 6px;font-size:14px;">🧘 <strong>C</strong> &mdash; Calm: Breathe, then begin</p>
        <p style="margin:0 0 6px;font-size:14px;">👀 <strong>L</strong> &mdash; Look: Read every word</p>
        <p style="margin:0 0 6px;font-size:14px;">✂️ <strong>E</strong> &mdash; Eliminate: Cross out wrong answers</p>
        <p style="margin:0 0 6px;font-size:14px;">❓ <strong>A</strong> &mdash; Answer: Choose with confidence</p>
        <p style="margin:0;font-size:14px;">✅ <strong>R</strong> &mdash; Review: Check before moving on</p>
      </div>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
        Print it out. Stick it on the fridge, the desk, or inside a homework folder.
        When the screens are off and the pen is in hand, the principles are still right there.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 4px;">
        You&rsquo;ve got this &mdash; and so has your child. 💪
      </p>
      <p style="font-size:15px;font-weight:700;color:#7c3aed;margin:0;">
        &mdash; Professor Hoot 🦉
      </p>
    </div>
    <div style="text-align:center;margin-top:24px;font-size:12px;color:#9ca3af;">
      <p style="margin:0 0 4px;">AnswerTheQuestion! &mdash; 11+ Exam Technique Training</p>
      <p style="margin:0;">
        <a href="https://answerthequestion.co.uk" style="color:#7c3aed;text-decoration:none;">answerthequestion.co.uk</a>
      </p>
    </div>
  </div>
</body>
</html>`;

// ─── Email Senders ──────────────────────────────────────────────

async function sendPaymentConfirmationEmail(customerEmail: string): Promise<void> {
  try {
    await sendEmail({
      to: customerEmail,
      subject: 'Your AnswerTheQuestion! access is confirmed 🎉',
      html: PAYMENT_CONFIRMATION_HTML,
    });
  } catch (err) {
    console.error('Failed to send payment confirmation email:', err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendCribSheetEmail(customerEmail: string, supabaseAdmin: any): Promise<void> {
  let pdfAttachment: { filename: string; content: Uint8Array; contentType: string } | undefined;
  try {
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('assets')
      .createSignedUrl('crib-sheet/CLEAR-Method-Crib-Sheet.pdf', 60);

    if (signedError || !signedData?.signedUrl) {
      console.error('Failed to create signed URL for crib sheet:', signedError);
    } else {
      const pdfResponse = await fetch(signedData.signedUrl);
      if (pdfResponse.ok) {
        const pdfBuffer = await pdfResponse.arrayBuffer();
        pdfAttachment = {
          filename: 'CLEAR-Method-Crib-Sheet.pdf',
          content: new Uint8Array(pdfBuffer),
          contentType: 'application/pdf',
        };
      } else {
        console.error(`Failed to fetch crib sheet PDF (${pdfResponse.status})`);
      }
    }
  } catch (err) {
    console.error('Error fetching crib sheet PDF:', err);
  }

  try {
    await sendEmail({
      to: customerEmail,
      subject: 'Your CLEAR Method Crib Sheet is here 🦉',
      html: CRIB_SHEET_EMAIL_HTML,
      ...(pdfAttachment ? { attachments: [pdfAttachment] } : {}),
    });
  } catch (err) {
    console.error('Failed to send crib sheet email:', err);
  }
}

// ─── Webhook Signature Verification ────────────────────────────
// LemonSqueezy uses HMAC-SHA256 of the raw body, hex-encoded, in X-Signature header.

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const computedSig = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return computedSig === signature;
}

// ─── Main Webhook Handler ───────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(clientIp, 100, 60_000);
  if (!rateLimitResult.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('X-Signature');

    if (!signature) {
      return new Response('Missing X-Signature header', { status: 400 });
    }

    const webhookSecret = Deno.env.get('LEMONSQUEEZY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('LEMONSQUEEZY_WEBHOOK_SECRET not set');
      return new Response('Webhook not configured', { status: 500 });
    }

    const valid = await verifySignature(body, signature, webhookSecret);
    if (!valid) {
      console.error('LemonSqueezy webhook signature verification failed');
      return new Response('Webhook signature verification failed', { status: 400 });
    }

    const event = JSON.parse(body);
    const eventName = event?.meta?.event_name;

    if (eventName === 'order_created') {
      const order = event.data;
      const orderId = String(order.id);
      const attrs = order.attributes;
      const customData = event.meta?.custom_data ?? {};

      const customerEmail = attrs.user_email as string | undefined;
      const parentId = customData.parent_id || null;
      const includeCribSheet = customData.include_crib_sheet === 'true';
      const status = attrs.status as string;

      // Only process paid orders
      if (status !== 'paid') {
        return new Response(JSON.stringify({ received: true, skipped: 'not paid' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      // Update or insert payment record
      // For guest checkout: parent_id was empty string at creation — match by email + pending status
      // For authenticated: parent_id is set — match by parent_id + pending status
      if (parentId) {
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            lemonsqueezy_order_id: orderId,
            include_crib_sheet: includeCribSheet,
            customer_email: customerEmail,
          })
          .eq('parent_id', parentId)
          .eq('status', 'pending');

        // Mark all child profiles as paid
        await supabase
          .from('child_profiles')
          .update({ has_paid: true })
          .eq('parent_id', parentId);
      } else if (customerEmail) {
        // Guest checkout — match by email
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            lemonsqueezy_order_id: orderId,
            include_crib_sheet: includeCribSheet,
            customer_email: customerEmail,
          })
          .eq('customer_email', customerEmail)
          .eq('status', 'pending');
      }

      console.log(`Order ${orderId} completed. parentId=${parentId ?? 'guest'}, crib_sheet=${includeCribSheet}`);

      // Fire-and-forget emails
      if (customerEmail) {
        const emailPromise = (async () => {
          try {
            await sendPaymentConfirmationEmail(customerEmail);
            if (includeCribSheet) {
              await sendCribSheetEmail(customerEmail, supabase);
            }
          } catch (emailErr) {
            console.error('Email sending failed (non-critical):', emailErr);
          }
        })();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (globalThis as any).EdgeRuntime?.waitUntil === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (globalThis as any).EdgeRuntime.waitUntil(emailPromise);
        }
      } else {
        console.error('No customer email on order — skipping emails');
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

- [ ] **Step 3: Deploy**

```bash
supabase functions deploy lemonsqueezy-webhook --no-verify-jwt
```

Expected: "Deployed Edge Function lemonsqueezy-webhook"

- [ ] **Step 4: Note the webhook URL**

The webhook endpoint URL is:
`https://ganlncdbebtnstgcewsd.supabase.co/functions/v1/lemonsqueezy-webhook`

This URL must be added to LemonSqueezy dashboard → Settings → Webhooks → Add endpoint.
Events to subscribe: `order_created`
After saving, copy the signing secret and run:
```bash
supabase secrets set LEMONSQUEEZY_WEBHOOK_SECRET=your_signing_secret_here
```

---

### Task 4: Archive the Stripe webhook function

**Files:**
- Delete: `supabase/functions/stripe-webhook/index.ts`

- [ ] **Step 1: Remove stripe-webhook directory**

```bash
rm -rf "/Users/rebeccaeverton/11+ Read the Question/supabase/functions/stripe-webhook"
```

**Note:** Also go to Stripe Dashboard → Developers → Webhooks and delete the webhook endpoint pointing to the Supabase function URL. This stops Stripe retry attempts.

- [ ] **Step 2: Verify removal**

```bash
ls "/Users/rebeccaeverton/11+ Read the Question/supabase/functions/"
```

Expected: `stripe-webhook` is no longer listed.

---

## Chunk 2: Frontend + Legal + CSP

### Task 5: Update CheckoutPage — add discount code input, remove Stripe branding

**Files:**
- Modify: `src/pages/CheckoutPage.tsx`

- [ ] **Step 1: Add discount code state and pass to edge function**

In `CheckoutPage.tsx`:

1. Add state after existing state declarations:
```typescript
const [discountCode, setDiscountCode] = useState('');
```

2. Add `discountCode` to the body in `handleCheckout`:
```typescript
const body: Record<string, unknown> = {
  successUrl: `${window.location.origin}/payment-success`,
  cancelUrl: `${window.location.origin}/checkout`,
  includeCribSheet,
  ...(discountCode.trim() ? { discountCode: discountCode.trim() } : {}),
};
```

3. Replace the existing discount code note (the `<p>` with "Have a discount code?"):
```tsx
{/* Discount code input */}
<div className="mb-4">
  <label className="block text-sm font-display font-semibold text-gray-600 mb-1.5">
    Discount code <span className="font-normal text-gray-400">(optional)</span>
  </label>
  <input
    type="text"
    value={discountCode}
    onChange={e => setDiscountCode(e.target.value.toUpperCase())}
    placeholder="e.g. WELCOME10"
    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 font-display text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder:text-gray-400 tracking-widest uppercase"
  />
</div>
```

4. Replace the trust signal line:
```tsx
{/* Trust signals */}
<div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400 font-display">
  <span>🛡️ Secure checkout</span>
  <span>🍋 Powered by LemonSqueezy</span>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/rebeccaeverton/11+ Read the Question" && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

---

### Task 6: Update UpgradePage — remove Stripe branding

**Files:**
- Modify: `src/pages/UpgradePage.tsx`

- [ ] **Step 1: Replace Stripe trust signal**

Find: `<span>Secure payment via Stripe</span>`
Replace with: `<span>Secure payment</span>`

- [ ] **Step 2: Verify**

```bash
grep -n "Stripe\|stripe" "/Users/rebeccaeverton/11+ Read the Question/src/pages/UpgradePage.tsx"
```

Expected: no matches.

---

### Task 7: Update PaymentSuccessPage — change `session_id` guard to `ls`

**Files:**
- Modify: `src/pages/PaymentSuccessPage.tsx`

- [ ] **Step 1: Update URL param references**

Find:
```typescript
const sessionId = searchParams.get('session_id');
```
Replace with:
```typescript
const sessionId = searchParams.get('ls');
```

Find:
```typescript
if (!sessionId || isGuest) return;
```
Remains the same — the guard still works, just using `ls` instead of `session_id`.

Find:
```typescript
if (isGuest && sessionId) {
```
Remains the same.

Find (in the dependency array comment):
```typescript
  }, [sessionId]);
```
Remains the same.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/rebeccaeverton/11+ Read the Question" && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

---

### Task 8: Update legal pages — replace Stripe with LemonSqueezy

**Files:**
- Modify: `src/pages/TermsPage.tsx`
- Modify: `src/pages/PrivacyPolicyPage.tsx`

- [ ] **Step 1: Update TermsPage**

Find:
```
Payment is processed securely by Stripe.
```
Replace with:
```
Payment is processed securely by LemonSqueezy.
```

- [ ] **Step 2: Update PrivacyPolicyPage**

Find (line ~40):
```
<li><strong>Payment data:</strong> processed securely by Stripe — we never see or store your card details</li>
```
Replace with:
```
<li><strong>Payment data:</strong> processed securely by LemonSqueezy — we never see or store your card details</li>
```

Find (line ~74):
```
<li><strong>Stripe:</strong> for payment processing (they have their own privacy policy)</li>
```
Replace with:
```
<li><strong>LemonSqueezy:</strong> for payment processing (they have their own privacy policy)</li>
```

- [ ] **Step 3: Verify no Stripe references remain in legal pages**

```bash
grep -n -i "stripe" \
  "/Users/rebeccaeverton/11+ Read the Question/src/pages/TermsPage.tsx" \
  "/Users/rebeccaeverton/11+ Read the Question/src/pages/PrivacyPolicyPage.tsx"
```

Expected: no matches.

---

### Task 9: Update CSP in vercel.json

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Replace Stripe domains with LemonSqueezy domains in Content-Security-Policy**

In the `Content-Security-Policy` header value:

Remove from `connect-src`:
- `https://api.stripe.com`

Add to `connect-src`:
- `https://api.lemonsqueezy.com`
- `https://*.lemonsqueezy.com`

Remove `frame-src` value entirely:
- `https://js.stripe.com https://hooks.stripe.com`

Replace with (LemonSqueezy uses a hosted redirect, not iframes):
- `frame-src 'none'`

The final `connect-src` should read:
```
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.lemonsqueezy.com https://*.lemonsqueezy.com https://fonts.googleapis.com https://fonts.gstatic.com https://vitals.vercel-analytics.com https://*.vercel-insights.com
```

- [ ] **Step 2: Verify no Stripe domains remain**

```bash
grep -i "stripe" "/Users/rebeccaeverton/11+ Read the Question/vercel.json"
```

Expected: no matches.

---

### Task 10: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update tech stack table**

Find:
```
| Payments | Stripe (£29.99 one-time, £4.99 bump) |
```
Replace with:
```
| Payments | LemonSqueezy (£29.99 one-time, £4.99 bump) |
```

- [ ] **Step 2: Update secrets list**

Find:
```
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
```
Replace with:
```
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
```

- [ ] **Step 3: Update Edge Functions table**

Find (create-checkout-session row):
```
| `create-checkout-session` | 10/min | Optional | Creates Stripe Checkout Session. Supports guest (email in body) or authenticated (JWT in header) |
```
Replace with:
```
| `create-checkout-session` | 10/min | Optional | Creates LemonSqueezy Checkout. Supports guest (email in body) or authenticated (JWT in header). Accepts optional `discountCode`. |
```

Find (stripe-webhook row):
```
| `stripe-webhook` | 100/min | Stripe sig | Handles `checkout.session.completed`. Marks payment complete, sends emails (fire-and-forget) |
```
Replace with:
```
| `lemonsqueezy-webhook` | 100/min | LemonSqueezy sig | Handles `order_created`. Marks payment complete, sends emails (fire-and-forget) |
```

- [ ] **Step 4: Update Key Decisions section**

Add new Key Decision entry (append after the last numbered item):

```markdown
38. **LemonSqueezy replaces Stripe (April 2026)**: `create-checkout-session` calls the LemonSqueezy v1 API to create a hosted checkout. The crib sheet bump uses `custom_price` override (2999 or 3498 pence) on variant 1470778 rather than a separate line item. `lemonsqueezy-webhook` verifies `X-Signature` (HMAC-SHA256, same web crypto pattern as the old Stripe manual verification). `claim-payment` is unchanged — it matches by email. Store ID: 935614. Main variant: 1470778. Discount codes (BETA100/WELCOME10/TUTOR10) are configured in LemonSqueezy dashboard and passed via `checkout_data.discount_code` from frontend.
```

---

## Chunk 3: Final Verification

### Task 11: Build check and grep audit

- [ ] **Step 1: TypeScript + Vite build**

```bash
cd "/Users/rebeccaeverton/11+ Read the Question" && npm run build 2>&1 | tail -15
```

Expected: `✓ built in X.Xs` — zero TypeScript errors.

- [ ] **Step 2: Full Stripe remnant grep**

```bash
grep -r -i "stripe" \
  "/Users/rebeccaeverton/11+ Read the Question/src" \
  "/Users/rebeccaeverton/11+ Read the Question/supabase" \
  "/Users/rebeccaeverton/11+ Read the Question/vercel.json" \
  --include="*.ts" --include="*.tsx" --include="*.json" \
  --exclude-dir="node_modules" --exclude-dir="dist" \
  -l 2>/dev/null
```

Expected: only question bank files (verbal-reasoning.ts etc.) which contain "stripe" as a word in question text — not payment code. No src/pages, supabase/functions, or vercel.json matches.

- [ ] **Step 3: Verify LemonSqueezy references exist**

```bash
grep -r -i "lemonsqueezy" \
  "/Users/rebeccaeverton/11+ Read the Question/src" \
  "/Users/rebeccaeverton/11+ Read the Question/supabase" \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir="node_modules" -l 2>/dev/null
```

Expected: at minimum `create-checkout-session/index.ts`, `lemonsqueezy-webhook/index.ts`, `CheckoutPage.tsx`, `PrivacyPolicyPage.tsx`.

---

## Post-Deployment Checklist (Manual — User Actions)

These cannot be automated — must be done in external dashboards:

- [ ] **LemonSqueezy Dashboard → Settings → Webhooks**
  - Add endpoint: `https://ganlncdbebtnstgcewsd.supabase.co/functions/v1/lemonsqueezy-webhook`
  - Events: `order_created`
  - Copy signing secret → `supabase secrets set LEMONSQUEEZY_WEBHOOK_SECRET=xxx`

- [ ] **LemonSqueezy Dashboard → Discount codes**
  - `BETA100`: 100% off, expires 2026-05-31
  - `WELCOME10`: 10% off, no expiry
  - `TUTOR10`: 10% off, no expiry

- [ ] **Stripe Dashboard → Developers → Webhooks**
  - Delete the webhook endpoint pointing to `stripe-webhook` Supabase function
  - (Stripe will keep retrying if you don't delete it)

- [ ] **End-to-end test**
  - Guest checkout with BETA100 code → verify £0 charged, confirm email received, crib sheet emailed
  - Authenticated checkout without code → verify £29.99 charged, confirm email received
  - Authenticated checkout with crib sheet + WELCOME10 → verify £31.49 charged, crib sheet emailed

- [ ] **Redeploy Vercel** (triggers on git push — vercel.json CSP changes need a deploy)
  ```bash
  git push
  ```
