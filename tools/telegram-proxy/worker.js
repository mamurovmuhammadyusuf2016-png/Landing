/**
 * Enquiry relay for academy-of-arabic.uz
 *
 * The site is static, so before this existed the page had to carry the bot
 * token itself to reach Telegram. Anyone who opened the source could read
 * it: flood the centre's chat with fake enquiries, post as the bot, and —
 * with no webhook set — pull delivered enquiries back out through
 * getUpdates. This worker holds the token instead and is the only thing
 * that talks to Telegram.
 *
 * It also sits on the site's own domain, which matters beyond the token:
 * api.telegram.org is blocked on a fair number of networks in Uzbekistan,
 * and every visitor on one of those used to drop into the manual fallback.
 *
 * Deploy: see README.md in this folder.
 */

/* Only these origins may post. A stranger can still call the worker, but
   not from a page pretending to be the site. */
const ALLOWED_ORIGINS = [
  "https://academy-of-arabic.uz",
  "https://www.academy-of-arabic.uz",
];

/* An enquiry is a few hundred characters. Anything much larger is not a
   person filling in the form. */
const MAX_BYTES = 4000;

/* Per-IP ceiling, refilled by the window. Telegram itself would keep up,
   but a flood would bury real enquiries in the chat. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

const hits = new Map();

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function rateLimited(ip) {
  const now = Date.now();
  const seen = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  seen.push(now);
  hits.set(ip, seen);

  /* the map lives as long as the isolate; drop stale keys as we go */
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return seen.length > RATE_LIMIT;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: allowed ? 204 : 403,
        headers: allowed ? corsHeaders(origin) : {},
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (!allowed) {
      return new Response("Forbidden", { status: 403 });
    }

    const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (rateLimited(ip)) {
      return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
        status: 429,
        headers,
      });
    }

    let text;
    try {
      const payload = await request.json();
      text = typeof payload.text === "string" ? payload.text.trim() : "";
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "bad_json" }), {
        status: 400,
        headers,
      });
    }

    if (!text || new TextEncoder().encode(text).length > MAX_BYTES) {
      return new Response(JSON.stringify({ ok: false, error: "bad_text" }), {
        status: 400,
        headers,
      });
    }

    const res = await fetch(
      `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.BOT_CHAT_ID, text }),
      }
    );
    const data = await res.json();

    /* Telegram's own reply can name the chat and the bot, so report the
       outcome only — the page needs nothing else to decide what to show. */
    return new Response(JSON.stringify({ ok: Boolean(data && data.ok) }), {
      status: data && data.ok ? 200 : 502,
      headers,
    });
  },
};
