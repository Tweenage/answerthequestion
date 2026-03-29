// Supabase Edge Function: stripe-webhook
// Handles Stripe webhook events (checkout.session.completed).
// Sends payment confirmation + optional crib sheet email via Resend.
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// Required secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
//
// SECURITY: In-memory rate limiting (100 req/min per IP) + Stripe signature verification.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14?target=deno';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const EMAIL_FROM = 'AnswerTheQuestion! <rebecca@answerthequestion.co.uk>';

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

  console.log(`Email sent to ${options.to}: "${options.subject}"`);
}

// ─── Email Templates ────────────────────────────────────────────

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
        When the screens are off and the pen is in hand, the principles are still
        right there.
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

async function sendCribSheetEmail(
  customerEmail: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseAdmin: any,
): Promise<void> {
  // Fetch the PDF via a short-lived signed URL so the bucket can be kept private
  let pdfAttachment: { filename: string; content: Uint8Array; contentType: string } | undefined;
  try {
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('assets')
      .createSignedUrl('crib-sheet/CLEAR-Method-Crib-Sheet.pdf', 60); // 60-second expiry

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

// ─── Main Webhook Handler ───────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  // Rate limit: 100 requests per minute per IP (Stripe sends bursts)
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(clientIp, 100, 60_000);
  if (!rateLimitResult.allowed) {
    const retryAfterSec = Math.ceil(rateLimitResult.retryAfterMs! / 1000);
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSec),
      },
    });
  }

  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return new Response('Missing stripe-signature header', { status: 400 });
    }

    // Manual HMAC-SHA256 signature verification (compatible with Supabase Edge / Deno)
    const sigParts = Object.fromEntries(
      sig.split(',').map(part => {
        const [key, ...rest] = part.split('=');
        return [key, rest.join('=')];
      })
    );
    const timestamp = sigParts['t'];
    const expectedSig = sigParts['v1'];

    if (!timestamp || !expectedSig) {
      return new Response('Invalid stripe-signature format', { status: 400 });
    }

    // Check timestamp is within 5 minutes (300 seconds)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > 300) {
      console.error(`Webhook timestamp too old: ${timestamp} vs now ${now}`);
      return new Response('Webhook timestamp out of tolerance', { status: 400 });
    }

    // Compute HMAC-SHA256 using Web Crypto API
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signedPayload = `${timestamp}.${body}`;
    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
    const computedSig = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (computedSig !== expectedSig) {
      console.error('Signature mismatch — computed:', computedSig.substring(0, 16), 'expected:', expectedSig.substring(0, 16));
      return new Response('Webhook signature verification failed', { status: 400 });
    }

    console.log('Webhook signature verified successfully');
    const event = JSON.parse(body) as Stripe.Event;

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const parentId = session.metadata?.parentId; // null for guest checkout
      const includeCribSheet = session.metadata?.includeCribSheet === 'true';
      const customerEmail = session.customer_email || session.customer_details?.email;

      // Use service role to bypass RLS
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      // Update payment record
      await supabase
        .from('payments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          stripe_payment_intent_id: session.payment_intent as string,
          include_crib_sheet: includeCribSheet,
          customer_email: customerEmail,
          ...(parentId ? { parent_id: parentId } : {}),
        })
        .eq('stripe_checkout_session_id', session.id);

      // If an authenticated user paid, mark ALL their child profiles as paid.
      if (parentId) {
        await supabase
          .from('child_profiles')
          .update({ has_paid: true })
          .eq('parent_id', parentId);
      }

      console.log(`Payment completed for session ${session.id}, parentId=${parentId ?? 'guest'}, crib_sheet=${includeCribSheet}`);

      // Send emails in background — don't block the response to Stripe
      // (SMTP is slow and can exceed Supabase Edge CPU limits)
      if (customerEmail) {
        // Fire-and-forget: use EdgeRuntime.waitUntil if available, otherwise just don't await
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

        // Try to keep the function alive for emails without blocking the response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (globalThis as any).EdgeRuntime?.waitUntil === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (globalThis as any).EdgeRuntime.waitUntil(emailPromise);
        }
        // If waitUntil isn't available, emails are best-effort
      } else {
        console.error('No customer email found on session — skipping emails');
      }
    }

    // Return 200 immediately so Stripe knows we received it
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
