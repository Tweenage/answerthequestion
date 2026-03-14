// Supabase Edge Function: stripe-webhook
// Handles Stripe webhook events (checkout.session.completed).
// If the crib sheet was purchased, sends the PDF via Resend email.
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// Required secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
//
// SECURITY: Rate limiting must be configured externally (Cloudflare WAF or
// Supabase Dashboard → Edge Functions → Rate Limiting) to prevent abuse.
// Stripe signature verification protects against forged payloads.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

// ─── Crib-Sheet Email via Resend ────────────────────────────────

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

/**
 * Send the CLEAR Method Crib Sheet PDF to the customer via Resend.
 * The PDF is fetched from Supabase Storage (public bucket "assets").
 * Non-critical: failures are logged but do not block payment processing.
 */
async function sendCribSheetEmail(customerEmail: string): Promise<void> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not set — skipping crib sheet email');
    return;
  }

  // Fetch the PDF from Supabase Storage and base64-encode it for the attachment.
  // Path: <SUPABASE_URL>/storage/v1/object/public/assets/crib-sheet/clear-method-crib-sheet.pdf
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const pdfStorageUrl = `${supabaseUrl}/storage/v1/object/public/assets/crib-sheet/CLEAR-Method-Crib-Sheet.pdf`;

  let pdfBase64: string | null = null;
  try {
    const pdfResponse = await fetch(pdfStorageUrl);
    if (pdfResponse.ok) {
      const pdfBuffer = await pdfResponse.arrayBuffer();
      // Convert ArrayBuffer to base64 string
      const uint8 = new Uint8Array(pdfBuffer);
      let binary = '';
      for (let i = 0; i < uint8.length; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      pdfBase64 = btoa(binary);
    } else {
      console.error(`Failed to fetch crib sheet PDF (${pdfResponse.status}). Email will be sent without attachment.`);
    }
  } catch (err) {
    console.error('Error fetching crib sheet PDF:', err);
  }

  // Build email payload
  const emailPayload: Record<string, unknown> = {
    from: 'Professor Hoot <hoot@answerthequestion.co.uk>',
    to: [customerEmail],
    subject: 'Your CLEAR Method Crib Sheet is here 🦉',
    html: CRIB_SHEET_EMAIL_HTML,
  };

  // Attach PDF if we were able to fetch it
  if (pdfBase64) {
    emailPayload.attachments = [
      {
        filename: 'CLEAR-Method-Crib-Sheet.pdf',
        content: pdfBase64,
      },
    ];
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (resendResponse.ok) {
      const result = await resendResponse.json();
      console.log(`Crib sheet email sent successfully — Resend ID: ${result.id}`);
    } else {
      const errorBody = await resendResponse.text();
      console.error(`Resend API error (${resendResponse.status}):`, errorBody);
    }
  } catch (err) {
    console.error('Failed to send crib sheet email:', err);
  }
}

// ─── Main Webhook Handler ───────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return new Response('Missing stripe-signature header', { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signature verification failed';
      console.error('Webhook signature verification failed:', message);
      return new Response(`Webhook Error: ${message}`, { status: 400 });
    }

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
      // For guest checkout (no parentId), the claim-payment function handles this
      // after the user creates an account and links their payment.
      if (parentId) {
        await supabase
          .from('child_profiles')
          .update({ has_paid: true })
          .eq('parent_id', parentId);
      }

      console.log(`Payment completed for session ${session.id}, parentId=${parentId ?? 'guest'}, crib_sheet=${includeCribSheet}`);

      // Send crib sheet email if purchased (non-blocking — failures are logged)
      if (includeCribSheet) {
        if (customerEmail) {
          await sendCribSheetEmail(customerEmail);
        } else {
          console.error('Crib sheet purchased but no customer email found on session');
        }
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
