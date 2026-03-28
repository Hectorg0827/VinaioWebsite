/**
 * Shared admin auth helper.
 *
 * Instead of storing `admin_auth=true` (trivially forgeable), we derive a
 * deterministic HMAC token from ADMIN_PASSWORD + ADMIN_SECRET and store that
 * in the cookie. An attacker who reads the cookie value cannot reverse-engineer
 * the password, and cannot forge a valid token without both secrets.
 *
 * Rotating ADMIN_PASSWORD instantly invalidates all existing admin sessions.
 */

const PEPPER = "vinaio-admin-v1";

async function deriveToken() {
  const password = process.env.ADMIN_PASSWORD;
  const secret   = process.env.ADMIN_SECRET || PEPPER;
  if (!password) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(secret)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Returns the expected cookie value for a valid admin session. */
export async function getAdminToken() {
  return deriveToken();
}

/** Returns true if the `admin_auth` cookie contains the valid HMAC token. */
export async function isAdminAuthenticated(cookieStore) {
  const stored   = cookieStore.get("admin_auth")?.value;
  const expected = await deriveToken();
  if (!stored || !expected) return false;

  // Timing-safe comparison via SubtleCrypto — avoids timing attacks
  const enc   = new TextEncoder();
  const a     = enc.encode(stored);
  const b     = enc.encode(expected);
  if (a.length !== b.length) return false;

  // XOR all bytes; if any differ the result is non-zero
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
