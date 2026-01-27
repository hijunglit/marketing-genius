import type { SupabaseClient } from "@supabase/supabase-js";
import browserClient, { type Database } from "~/supa-client";

export const getContents = async (client: SupabaseClient<Database>) => {
  const { data, error } = await browserClient.from("contents").select(`
      request:request_contents!inner(
        title,
        platform
      ),
      text,
      hashtag,
      images!inner (
        image_url
      ),
      created_at
    `);
  console.log(data, error);
  if (error) throw new Error(error.message);
  return data;
};
