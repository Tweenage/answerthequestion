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
  // Reject obviously invalid signatures before touching crypto
  if (!/^[0-9a-f]+$/i.test(signature)) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  // Decode hex signature to bytes and verify using crypto.subtle.verify,
  // which performs a constant-time comparison internally.
  const sigBytes = new Uint8Array(signature.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  return crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(body));
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
