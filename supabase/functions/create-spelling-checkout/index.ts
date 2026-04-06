// Supabase Edge Function: create-spelling-checkout
// Creates a LemonSqueezy checkout for ATQ Spelling Bee.
// Supports both authenticated users and guest checkout.
// Deploy: supabase functions deploy create-spelling-checkout
// Required secrets: LEMONSQUEEZY_API_KEY
//
// TODO: Wire up LemonSqueezy API - store 326946, variant TBD
// SECURITY: In-memory rate limiting recommended (10 req/min per IP)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // ── Parse body ───────────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const { discountCode } = body as { discountCode?: string };

    // TODO: Create LemonSqueezy checkout via API
    // - Store ID: 326946
    // - Variant ID: TBD (set once product is created in LS dashboard)
    // - Apply discountCode if provided
    // - Record pending payment in DB
    // - Return real checkout URL from LS response

    const placeholderUrl = 'https://atqspelling.lemonsqueezy.com/checkout/buy/placeholder';

    return new Response(JSON.stringify({ url: placeholderUrl }), {
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
