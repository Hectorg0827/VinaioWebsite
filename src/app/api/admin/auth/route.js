import { NextResponse } from "next/server";
import { cookies }      from "next/headers";
import { getAdminToken } from "@/lib/admin/auth";

// ── In-memory rate limiter ────────────────────────────────────────────────────
// Limits to 10 attempts per IP per 15 minutes.
// Note: works per serverless instance — sufficient for a low-traffic admin panel.
const attempts = new Map(); // ip -> { count, resetAt }
const MAX_ATTEMPTS   = 10;
const WINDOW_MS      = 15 * 60 * 1000; // 15 minutes

function getRateLimit(ip) {
  const now  = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    const next = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(ip, next);
    return next;
  }
  return entry;
}

function recordFailure(ip) {
  const entry = getRateLimit(ip);
  entry.count += 1;
  attempts.set(ip, entry);
}

function clearAttempts(ip) {
  attempts.delete(ip);
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Admin panel not configured." }, { status: 503 });
  }

  // Identify requester by IP (Vercel forwards real IP in x-forwarded-for)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";

  const rl = getRateLimit(ip);
  if (rl.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { password } = body;

  if (typeof password !== "string" || password !== adminPassword) {
    recordFailure(ip);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  // Correct password — clear rate limit and set HMAC token cookie
  clearAttempts(ip);
  const token = await getAdminToken();

  const cookieStore = await cookies();
  cookieStore.set("admin_auth", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   60 * 60 * 8, // 8 hours
    path:     "/admin",    // scoped to /admin only
  });

  return NextResponse.json({ ok: true });
}
