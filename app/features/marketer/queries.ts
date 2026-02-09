import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getMarketer = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  const { data, error } = await client
    .from("ai")
    .select(
      `
          ai_id,
          company_name,
          category,
          company_description,
          core_service
        `
    )
    .eq("profile_id", id);
  if (error) throw new Error(error.message);
  return data;
};
