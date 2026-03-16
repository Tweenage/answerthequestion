// Supabase Edge Function: create-checkout-session
// Creates a Stripe Checkout Session for a one-time £19.99 payment.
// Optionally adds the CLEAR Method Crib Sheet (£4.99) as a second line item.
// Supports both authenticated users and guest checkout (pay first, create account after).
// Deploy: supabase functions deploy create-checkout-session
// Required secrets: STRIPE_SECRET_KEY
//
// SECURITY: In-memory rate limiting (10 req/min per IP) + external limits recommended.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const PROD_ORIGINS = [
  'https://answerthequestion.co.uk',
  'https://www.answerthequestion.co.uk',
];

/**
 * Check whether an origin is trusted for CORS and redirect validation.
 * Accepts: production domains, Vercel preview/production deployments,
 * and localhost when ALLOW_LOCALHOST=true.
 */
function isTrustedOrigin(origin: string): boolean {
  if (PROD_ORIGINS.includes(origin)) return true;
  // Vercel preview & production deployments (*.vercel.app)
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true;
  // localhost for local dev
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
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  // Rate limit: 10 requests per minute per IP
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // ── Try to authenticate (optional — guest checkout is allowed) ──
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
      // If getUser fails, treat as guest checkout (anon key was sent)
    }

    const { successUrl, cancelUrl, includeCribSheet, email } = await req.json();

    // For guest checkout, require an email address
    if (!userId) {
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return new Response(JSON.stringify({ error: 'Email is required for checkout' }), {
          status: 400,
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
      }
      customerEmail = email.trim().toLowerCase();
    }

    // Validate redirect URLs — must be HTTPS from a trusted origin (or localhost in dev)
    const isAllowedUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        return isTrustedOrigin(parsed.origin);
      } catch {
        return false;
      }
    };

    if (!successUrl || !cancelUrl || !isAllowedUrl(successUrl) || !isAllowedUrl(cancelUrl)) {
      return new Response(JSON.stringify({ error: 'Invalid redirect URL' }), {
        status: 400,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    // Build line items — always include the main programme
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: 1999, // £19.99 in pence
          product_data: {
            name: 'Answer The Question — Full Access',
            description: '12-week 11+ exam technique training programme. One-time payment, access forever.',
          },
        },
        quantity: 1,
      },
    ];

    // Add crib sheet as a second line item if selected
    if (includeCribSheet) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          unit_amount: 499, // £4.99 in pence
          product_data: {
            name: 'CLEAR Method Crib Sheet (PDF)',
            description: 'Printable one-page summary of the CLEAR Method exam technique. Available for download after purchase.',
          },
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    // allow_promotion_codes lets Stripe show its own "Add promotion code" field
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment' as const,
      allow_promotion_codes: true,
      line_items: lineItems,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}${includeCribSheet ? '&crib_sheet=1' : ''}`,
      cancel_url: cancelUrl,
      // Pre-fill email on checkout page (no customer_creation to avoid empty name errors with promo codes)
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      metadata: {
        ...(userId ? { parentId: userId } : {}),
        includeCribSheet: includeCribSheet ? 'true' : 'false',
        ...(customerEmail ? { customerEmail } : {}),
      },
    });

    // Record pending payment in database
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabaseAdmin.from('payments').insert({
      // parent_id is null for guest checkout — will be linked via claim-payment later
      ...(userId ? { parent_id: userId } : {}),
      customer_email: customerEmail,
      stripe_checkout_session_id: session.id,
      amount_pence: includeCribSheet ? 2498 : 1999,
      currency: 'gbp',
      status: 'pending',
      include_crib_sheet: !!includeCribSheet,
    });

    return new Response(JSON.stringify({ url: session.url }), {
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
