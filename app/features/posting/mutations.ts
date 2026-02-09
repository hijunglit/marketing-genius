import type { SupabaseClient } from "@supabase/supabase-js";
import { openai } from "~/lib/openai";
import type { Database } from "~/supa-client";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// LLM 응답 스키마
const PostingResponseSchema = z.object({
  title: z.string().describe("포스팅 제목"),
  text: z.string().describe("포스팅 본문 내용"),
  hashtags: z.array(z.string()).describe("해시태그 배열 (# 포함)"),
});

export type PostingResponse = z.infer<typeof PostingResponseSchema>;

// 이미지 업로드
// export const uploadImage = async (
//     client: SupabaseClient<Database>,
//     {
//         id,
//         imageUrl,
//     contents_id,
//     }: {
//             id: string;
//             imageUrl: string;
//             contents_id: string;
//     }
// ) => {
//     const { error } = await client.from("images").insert({
//         image_url: imageUrl,

//     })
// };

// request_contents INSERT
export const createRequestContents = async (
  client: SupabaseClient<Database>,
  {
    profileId,
    aiId,
    title,
    platform,
    template,
    productName,
    target,
    coreMessage,
  }: {
    profileId: string;
    aiId: number;
    title: string;
    platform: string;
    template: string;
    productName: string;
    target: string;
    coreMessage: string;
  }
) => {
  const { data, error } = await client
    .from("request_contents")
    .insert({
      profile_id: profileId,
      ai_id: aiId,
      title,
      platform,
      template,
      product_name: productName,
      target,
      core_message: coreMessage,
      is_confirm: false,
    })
    .select("request_id")
    .single();

  if (error) throw error;
  return data.request_id;
};

// LLM 호출 (structured output)
export const generatePosting = async ({
  platform,
  template,
  productName,
  targetCustomer,
  coreCharacter,
}: {
  platform: string;
  template: string;
  productName: string;
  targetCustomer: string;
  coreCharacter: string;
}): Promise<PostingResponse> => {
  const prompt = `당신은 소셜 미디어 마케팅 전문가입니다. 다음 정보를 바탕으로 ${platform} 포스팅을 작성해주세요.

**제품/서비스명**: ${productName}
**타겟 고객층**: ${targetCustomer}
**핵심 특징**: ${coreCharacter}
**템플릿 스타일**: ${template}

다음 형식으로 작성해주세요:
- title: 눈길을 끄는 제목
- text: 플랫폼에 맞는 본문 (이모지 적절히 사용)
- hashtags: 관련 해시태그 5-10개`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(PostingResponseSchema, "posting"),
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("LLM 응답이 없습니다");

  return JSON.parse(content) as PostingResponse;
};

// contents + images INSERT + is_confirm 업데이트
export const confirmPosting = async (
  client: SupabaseClient<Database>,
  {
    requestId,
    text,
    hashtags,
    imageUrls,
  }: {
    requestId: number;
    text: string;
    hashtags: string[];
    imageUrls: string[];
  }
) => {
  // 1. contents INSERT
  const { data, error: contentsError } = await client.rpc(
    "confirm_request_contents",
    {
      p_request_id: requestId,
      p_text: text,
      p_hashtag: hashtags.join(" "),
      p_image_urls: imageUrls,
    }
  );

  if (contentsError) throw contentsError;

  const contentsId = typeof data === "string" ? Number(data) : (data as number);

  if (!Number.isFinite(contentsId)) {
    throw new Error("Invalid contentsId returned from RPC");
  }

  return contentsId;
};
