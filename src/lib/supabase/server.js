import { createClient as createClientServer, createAdminClient as adminClientServer } from "@/utils/supabase/server";

export async function createClient() {
  return createClientServer();
}

export async function createAdminClient() {
  return adminClientServer();
}
