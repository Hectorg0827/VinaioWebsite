import { NextResponse } from "next/server";
import { cookies }      from "next/headers";
import { getAdminToken } from "@/lib/admin/auth";
import { authenticateAdmin, generateSessionToken } from "@/lib/admin/userAuth";

// ── In-memory rate limiter ────────────────────────────────────────────────────
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
  // Identify requester by IP
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
  const { username, password } = body;

  let sessionToken = null;

  // 1. Try Multi-user Auth (if username provided)
  if (username && password) {
    const user = await authenticateAdmin(username, password);
    if (user) {
      sessionToken = await generateSessionToken(user);
    }
  } 
  
  // 2. Fallback to Legacy Auth (if only password provided or user not found)
  if (!sessionToken && password && !username) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword && password === adminPassword) {
      sessionToken = await getAdminToken();
    }
  }

  if (!sessionToken) {
    recordFailure(ip);
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  // Success — clear rate limit and set cookie
  clearAttempts(ip);
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", sessionToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   60 * 60 * 8, // 8 hours
    path:     "/",
  });

  return NextResponse.json({ ok: true });
}
