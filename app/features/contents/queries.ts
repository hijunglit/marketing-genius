import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getContents = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  const { data, error } = await client
    .from("contents")
    .select(
      `
      request_contents!inner(
        title,
        platform,
        product_name
      ),
      text,
      hashtag,
      images (
        image_url
      ),
      created_at
    `
    )
    .eq("request_contents.profile_id", id)
    .eq("request_contents.is_confirm", true);
  if (error) throw new Error(error.message);
  return data;
};
