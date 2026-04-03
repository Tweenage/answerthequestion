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

    // Append ls=1 so success page knows we came from a real payment
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
