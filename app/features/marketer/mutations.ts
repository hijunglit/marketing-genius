import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createMarketer = async (
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
  },
) => {
  const { data, error } = await client
    .from("ai")
    .insert({
      company_name: companyName,
      category,
      core_service: coreService,
      company_description: aboutCompany,
      profile_id: userId,
    })
    .select("ai_id")
    .single();
  if (error) throw error;
  return data.ai_id;
};

export const updateMarketer = async (
  client: SupabaseClient<Database>,
  {
    id,
    brandName,
    category,
    description,
    coreService,
  }: {
    id: string;
    brandName: string;
    category: string;
    description: string;
    coreService: string;
  },
) => {
  const { error } = await client
    .from("ai")
    .update({
      company_name: brandName,
      category,
      company_description: description,
      core_service: coreService,
    })
    .eq("profile_id", id);
  if (error) {
    throw error;
  }
};
