import { createAdminClient } from "@/lib/supabase/server";
import crypto from "node:crypto";

/**
 * Multi-user admin authentication helper.
 */

const SALT_ROUNDS = 1000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/** Hash a password using PBKDF2 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, KEY_LENGTH, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

/** Verify a password against a hash */
export function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  const verifyHash = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, KEY_LENGTH, DIGEST).toString("hex");
  return hash === verifyHash;
}

/** Authenticate an admin user against the database */
export async function authenticateAdmin(username, password) {
  const supabase = await createAdminClient();
  if (!supabase) return null;

  const { data: user, error } = await supabase
    .from("site_admins")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !user) return null;

  const isValid = verifyPassword(password, user.password_hash);
  if (!isValid) return null;

  return { id: user.id, username: user.username };
}

/** 
 * Generate a session token for an admin user.
 * We include the user ID and username in the token to support multi-user.
 */
export async function generateSessionToken(user) {
  const secret = process.env.ADMIN_SECRET || "vinaio-admin-v1";
  const data = JSON.stringify({ id: user.id, username: user.username, timestamp: Date.now() });
  
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  const signature = hmac.digest("hex");
  
  return Buffer.from(JSON.stringify({ data, signature })).toString("base64");
}

/** Verify a session token */
export async function verifySessionToken(token) {
  if (!token) return null;
  
  try {
    const secret = process.env.ADMIN_SECRET || "vinaio-admin-v1";
    const { data, signature } = JSON.parse(Buffer.from(token, "base64").toString());
    
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");
    
    if (signature !== expectedSignature) return null;
    
    const parsedData = JSON.parse(data);
    // Check if token is older than 8 hours
    if (Date.now() - parsedData.timestamp > 1000 * 60 * 60 * 8) return null;
    
    return parsedData;
  } catch (e) {
    return null;
  }
}
