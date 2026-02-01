import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const CreateMarketer = async (
  client: SupabaseClient<Database>,
  {
    companyName,
    category,
    coreService,
    aboutCompany,
    userId,
  }: {
    companyName: string;
    category: string;
    coreService: string;
    aboutCompany: string;
    userId: string;
  }
) => {
  const { data, error } = await client
    .from("ai")
    .insert({
      company_name: companyName,
      category,
      core_service: coreService,
      company_description: aboutCompany,
      profiles_id: userId,
    })
    .select("ai_id")
    .single();
  if (error) throw error;
  return data.ai_id;
};
