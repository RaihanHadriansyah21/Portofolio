import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for server-only privileged operations.
 *
 * Never import this module from a Client Component, and never expose the
 * service-role key with a NEXT_PUBLIC_ prefix.
 */
export function getServiceRoleSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
