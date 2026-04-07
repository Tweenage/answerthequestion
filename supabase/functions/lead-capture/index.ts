// Supabase Edge Function: lead-capture
// Captures email leads from the Spelling Bees landing page.
// Inserts into `email_leads` table, then emails the free word list PDF via Resend.
// Deploy: supabase functions deploy lead-capture
// Required secrets: RESEND_API_KEY
//
// SECURITY: Rate limit recommended (10 req/min per IP) to prevent spam

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EMAIL_FROM = 'Spelling Bees <hello@spellingbees.co.uk>';

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  console.log(`Email sent: "${options.subject}" to ${options.to}`);
}

// ─── Word List Email HTML ────────────────────────────────────────

const WORD_LIST_EMAIL_HTML = `
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
      Your word list is here!
    </h1>
    <p style="text-align:center;color:#78716c;font-size:15px;margin-bottom:28px;">
      50 of the trickiest 11+ spelling words, ready to practise.
    </p>
    <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #fde68a;margin-bottom:24px;">
      <h2 style="color:#d97706;font-size:16px;margin:0 0 12px 0;">How to use it</h2>
      <ol style="color:#44403c;font-size:14px;line-height:1.8;padding-left:20px;margin:0;">
        <li><strong>Print the PDF</strong> (attached to this email)</li>
        <li><strong>Pick five words</strong> from the word list at the front</li>
        <li><strong>Learn</strong> each word, its meaning, and the spelling hint</li>
        <li><strong>Turn to the practice pages</strong> and find the matching numbers</li>
        <li><strong>Spell</strong> the word five times using only the definition as your clue</li>
        <li><strong>Check</strong> your answers against the word list</li>
      </ol>
    </div>
    <div style="background:#fffbeb;border-radius:12px;padding:20px;border:1px solid #fde68a;margin-bottom:24px;">
      <p style="color:#92400e;font-size:14px;font-weight:bold;margin:0 0 8px 0;text-align:center;">
        Liked the workbook? There are 624 words in the full app.
      </p>
      <p style="color:#78716c;font-size:13px;text-align:center;margin:0 0 16px 0;">
        Spelling Bees gives your child daily practice with spaced repetition,
        mastery tracking, and sessions they can do on their own &mdash; just
        &pound;19.99, one-time, for the whole family.
      </p>
      <div style="text-align:center;">
        <a href="https://spellingbees.co.uk" style="display:inline-block;background:linear-gradient(to right,#f59e0b,#f97316,#ef4444);color:#fff;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;">
          Get Spelling Bees &mdash; &pound;19.99
        </a>
      </div>
    </div>
    <hr style="border:none;border-top:1px solid #fde68a;margin:24px 0;" />
    <p style="color:#a8a29e;font-size:11px;text-align:center;">
      Spelling Bees &mdash; spellingbees.co.uk &mdash; Part of the Tweenage family
    </p>
  </div>
</body>
</html>
`;

// ─── Send Word List PDF Email ────────────────────────────────────

async function sendWordListEmail(
  customerEmail: string,
  supabase: ReturnType<typeof createClient>,
): Promise<void> {
  let pdfAttachment: { filename: string; content: Uint8Array; contentType: string } | undefined;

  try {
    const { data: signedData, error: signedError } = await supabase.storage
      .from('assets')
      .createSignedUrl('spelling-bee/50-Trickiest-11-Plus-Words.pdf', 60);

    if (signedError || !signedData?.signedUrl) {
      console.error('Failed to create signed URL for word list:', signedError);
    } else {
      const pdfResponse = await fetch(signedData.signedUrl);
      if (pdfResponse.ok) {
        const pdfBuffer = await pdfResponse.arrayBuffer();
        pdfAttachment = {
          filename: '50-Trickiest-11-Plus-Spelling-Words.pdf',
          content: new Uint8Array(pdfBuffer),
          contentType: 'application/pdf',
        };
      } else {
        console.error(`Failed to fetch word list PDF (${pdfResponse.status})`);
      }
    }
  } catch (err) {
    console.error('Error fetching word list PDF:', err);
  }

  try {
    await sendEmail({
      to: customerEmail,
      subject: 'Your 50 Trickiest Spelling Words are here! 🐝',
      html: WORD_LIST_EMAIL_HTML,
      ...(pdfAttachment ? { attachments: [pdfAttachment] } : {}),
    });
  } catch (err) {
    console.error('Failed to send word list email:', err);
  }
}

// ─── Main Handler ────────────────────────────────────────────────

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
    const body = await req.json().catch(() => ({}));
    const { email } = body as { email?: string };

    // ── Validate email ───────────────────────────────────────────
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return new Response(JSON.stringify({ error: 'A valid email address is required' }), {
        status: 400,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Insert into email_leads ──────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabase
      .from('email_leads')
      .upsert(
        { email: normalizedEmail, source: 'spelling-landing' },
        { onConflict: 'email' }
      );

    if (insertError) {
      console.error('Failed to insert lead:', insertError.message);
      return new Response(JSON.stringify({ success: false, error: 'Failed to save email' }), {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // ── Return success immediately, send email in background ─────
    // Fire-and-forget: don't block the response on email delivery
    const emailPromise = sendWordListEmail(normalizedEmail, supabase);

    // Use EdgeRuntime.waitUntil if available (keeps function alive for async work)
    try {
      // @ts-ignore — EdgeRuntime may not be typed
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(emailPromise);
      }
    } catch {
      // Swallow — worst case the email still fires
    }

    return new Response(JSON.stringify({ success: true }), {
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
