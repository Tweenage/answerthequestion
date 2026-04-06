// Supabase Edge Function: send-welcome-email
// Sends a branded welcome email via Resend when a new account is created.
// Called from the frontend after successful signup.
// Deploy: supabase functions deploy send-welcome-email
// Required secrets: RESEND_API_KEY

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.ts';

const EMAIL_FROM = 'AnswerTheQuestion! <hello@answerthequestion.co.uk>';

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

const WELCOME_EMAIL_HTML = `<!DOCTYPE html>
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
        Welcome to AnswerTheQuestion!
      </h1>
      <p style="font-size:14px;color:#6b7280;margin:0;">
        From Professor Hoot
      </p>
    </div>
    <div style="background:white;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
        Welcome aboard! Your account is all set up. 🎉
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
        <strong>AnswerTheQuestion!</strong> helps your child build the exam technique habits
        they need to show what they know under pressure. No more lost marks from
        misreading questions or rushing through answers.
      </p>
      <div style="background:#faf5ff;border-radius:12px;padding:16px;margin:0 0 16px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#7c3aed;">Here&rsquo;s how it works:</p>
        <p style="margin:0 0 4px;font-size:14px;">1️⃣ Add your child&rsquo;s profile</p>
        <p style="margin:0 0 4px;font-size:14px;">2️⃣ Start the 12-week CLEAR Method programme</p>
        <p style="margin:0 0 4px;font-size:14px;">3️⃣ Just a few minutes of practice each day</p>
        <p style="margin:0;font-size:14px;">4️⃣ Watch their confidence and technique grow</p>
      </div>
      <div style="text-align:center;margin:20px 0;">
        <a href="https://answerthequestion.co.uk/login" style="display:inline-block;padding:14px 28px;background:linear-gradient(to right,#7c3aed,#c026d3);color:white;font-weight:700;font-size:16px;text-decoration:none;border-radius:12px;">
          Get Started &rarr;
        </a>
      </div>
      <p style="font-size:15px;line-height:1.6;margin:0 0 4px;">
        We&rsquo;re so glad you&rsquo;re here. Let&rsquo;s do this! 💪
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  // Rate limit: 5 requests per minute per IP
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(clientIp, 5, 60_000);
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
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      console.error('RESEND_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [user.email],
        subject: 'Welcome to AnswerTheQuestion! 🦉',
        html: WELCOME_EMAIL_HTML,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Resend error ${res.status}: ${text}`);
    }

    console.log(`Welcome email sent to user ${user.id}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Welcome email error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
