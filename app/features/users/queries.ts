import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getUserProfile = async (
  client: SupabaseClient<Database>,
  { username }: { username: string },
) => {
  const { data, error } = await client
    .from("profiles")
    .select(
      `
    profile_id,
    name,
    username,
    avatar_url        
    `,
    )
    .eq("username", username)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const getUserById = async (
  client: SupabaseClient<Database>,
  { id }: { id: string },
) => {
  const { data, error } = await client
    .from("profiles")
    .select(
      `
    profile_id,
    name,
    username,
    avatar_url        
    `,
    )
    .eq("profile_id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};
