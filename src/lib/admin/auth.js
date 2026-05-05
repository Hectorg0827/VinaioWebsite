import { verifySessionToken } from "./userAuth";

const PEPPER = "vinaio-admin-v1";

async function deriveToken() {
  const password = process.env.ADMIN_PASSWORD;
  const secret   = process.env.ADMIN_SECRET || PEPPER;
  if (!password) return null;

  const _crypto = globalThis.crypto || (typeof require !== 'undefined' ? require('node:crypto').webcrypto : null);
  if (!_crypto || !_crypto.subtle) {
    console.error("WebCrypto not available in this environment.");
    return null;
  }

  const key = await _crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await _crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(secret)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Returns the expected cookie value for a valid admin session (legacy). */
export async function getAdminToken() {
  return deriveToken();
}

/** Returns true if the `admin_auth` cookie contains a valid admin session. */
export async function isAdminAuthenticated(cookieStore) {
  const stored = cookieStore.get("admin_auth")?.value;
  if (!stored) return false;

  // 1. Try new multi-user token
  const user = await verifySessionToken(stored);
  if (user) return true;

  // 2. Fallback to legacy HMAC token
  const expected = await deriveToken();
  if (!expected) return false;

  const enc   = new TextEncoder();
  const a     = enc.encode(stored);
  const b     = enc.encode(expected);
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
