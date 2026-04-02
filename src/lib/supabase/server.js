import { createClient as createClientServer } from "@/utils/supabase/server";

export async function createClient() {
  return createClientServer();
}
