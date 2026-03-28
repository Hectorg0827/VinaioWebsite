/**
 * Safely get the current user from Supabase.
 * Returns null if Supabase is not configured (e.g. missing env vars in local dev).
 */
import { createClient } from "./server";

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return { user: data?.user ?? null, supabase };
  } catch {
    return { user: null, supabase: null };
  }
}
