import type { Route } from "./+types/create-posting-page";
import { Button } from "~/common/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Link, useFetcher, redirect, Form, useLoaderData } from "react-router";
import { Separator } from "~/common/components/ui/separator";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  LoaderCircle,
  RefreshCw,
  Check,
} from "lucide-react";
import {
  generatePosting,
  createRequestContents,
  confirmPosting,
  type PostingResponse,
} from "../mutations";
import z from "zod";
import browserClient, { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/users/queries";
import { PLATFORM_TYPE, TEMPLATE_TYPE } from "../constants";
import { getMarketer } from "~/features/marketer/queries";
import { createBrowserClient } from "@supabase/ssr";

export function meta({}: Route.MetaArgs) {
  return [{ title: "포스팅 생성" }];
}

const generateSchema = z.object({
  intent: z.literal("generate"),
  platform: z.enum(PLATFORM_TYPE as [string, ...string[]]),
  template: z.enum(TEMPLATE_TYPE as [string, ...string[]]),
  productName: z.string().min(1),
  targetCustomer: z.string().min(1),
  coreCharacter: z.string().min(1),
  aiId: z.coerce.number(),
});

const confirmSchema = z.discriminatedUnion("stage", [
  z.object({
    intent: z.literal("confirm"),
    stage: z.literal("plan"),
    requestId: z.coerce.number(),
    title: z.string(),
    text: z.string(),
    hashtags: z.string(), // JSON string
    fileMeta: z.string(), // JSON string
  }),
  z.object({
    intent: z.literal("confirm"),
    stage: z.literal("finalize"),
    requestId: z.coerce.number(),
    title: z.string(),
    text: z.string(),
    hashtags: z.string(), // JSON string
    imageUrls: z.string(), // JSON string
  }),
]);

const regenerateSchema = z.object({
  intent: z.literal("regenerate"),
  platform: z.string(),
  template: z.string(),
  productName: z.string(),
  targetCustomer: z.string(),
  coreCharacter: z.string(),
  requestId: z.coerce.number(),
  imageUrls: z.string(), // JSON string
  aiId: z.coerce.number(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    // Generate: 이미지 업로드 + request_contents 생성 + LLM 호출
    if (intent === "generate") {
      const parsed = generateSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { ok: false, error: "입력값이 올바르지 않습니다" };
      }
      const {
        platform,
        template,
        productName,
        targetCustomer,
        coreCharacter,
        aiId,
      } = parsed.data;

      // 이미지 업로드
      const files = formData.getAll("files") as File[];
      let imageUrls: string[] = [];
      if (files && files instanceof File) {
        if (files.size <= 5097152 && files.type.startsWith("image/")) {
        }
      }

      // request_contents INSERT
      const requestId = await createRequestContents(client, {
        profileId: userId,
        aiId,
        title: productName,
        platform,
        template,
        productName,
        target: targetCustomer,
        coreMessage: coreCharacter,
      });

      // LLM 호출
      const preview = await generatePosting(client, {
        aiId,
        platform,
        template,
        productName,
        targetCustomer,
        coreCharacter,
      });

      return {
        ok: true,
        intent: "generate",
        preview,
        requestId,
        imageUrls,
        formData: {
          platform,
          template,
          productName,
          targetCustomer,
          coreCharacter,
        },
      };
    }

    // Confirm: contents + images INSERT + is_confirm 업데이트
    if (intent === "confirm") {
      const parsed = confirmSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { ok: false, error: parsed.error.flatten() };
      }

      if (parsed.data.stage === "plan") {
        const fileMeta = JSON.parse(parsed.data.fileMeta) as Array<{
          name: string;
          type: string;
          size: number;
        }>;
        if (fileMeta.length === 0)
          return { ok: false, error: "이미지는 필수입니다." };
        const bucket = "posting-images";
        const targets = await Promise.all(
          fileMeta.map(async (m, order) => {
            const ext = (m.name.split(".").pop() || "jpg").toLowerCase();
            const path = `posting/${userId}/${parsed.data.requestId}/${crypto.randomUUID()}.${ext}`;

            const { data, error } = await client.storage
              .from(bucket)
              .createSignedUploadUrl(path);
            if (error) throw error;

            return { order, path, token: data.token };
          }),
        );
        return { ok: true, intent: "confirm", stage: "plan", bucket, targets };
      }

      // finalize
      const { requestId, text, hashtags, imageUrls } = parsed.data;

      const parsedImageUrls = JSON.parse(imageUrls);

      if (!Array.isArray(parsedImageUrls) || parsedImageUrls.length === 0) {
        return { ok: false, error: "이미지는 필수입니다." };
      }

      await confirmPosting(client, {
        requestId,
        text,
        hashtags: JSON.parse(hashtags),
        imageUrls: parsedImageUrls,
      });

      return redirect("/contents");
    }

    // Regenerate: 같은 requestId로 다시 LLM 호출
    if (intent === "regenerate") {
      const parsed = regenerateSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { ok: false, error: "재생성 데이터가 올바르지 않습니다" };
      }
      const {
        platform,
        template,
        productName,
        targetCustomer,
        coreCharacter,
        requestId,
        imageUrls,
        aiId,
      } = parsed.data;

      const preview = await generatePosting(client, {
        aiId,
        platform,
        template,
        productName,
        targetCustomer,
        coreCharacter,
      });

      return {
        ok: true,
        intent: "regenerate",
        preview,
        requestId,
        imageUrls: JSON.parse(imageUrls),
        formData: {
          platform,
          template,
          productName,
          targetCustomer,
          coreCharacter,
        },
      };
    }

    return { ok: false, error: "알 수 없는 요청입니다" };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "오류가 발생했습니다",
    };
  }
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  if (!user) {
    return redirect("/auth/login");
  }
  const marketer = await getMarketer(client, { id: user?.id });
  return { marketer, env };
};

type Payload = {
  platform: "instagram" | null;
  template: "basic" | "list" | "image" | "question" | "tip-knowhow" | null;
  requestForm: {
    files: File[] | null;
    productName: string;
    targetCustomer: string;
    coreCharacter: string;
  } | null;
};

type GenerateResponse = {
  ok: true;
  intent: "generate";
  preview: PostingResponse;
  requestId: number;
  imageUrls: string[];
  formData: {
    platform: string;
    template: string;
    productName: string;
    targetCustomer: string;
    coreCharacter: string;
  };
};

type ConfirmPlanResponse = {
  ok: true;
  intent: "confirm";
  stage: "plan";
  bucket: string;
  targets: Array<{ order: number; path: string; token: string }>;
};

type ErrorResponse = {
  ok: false;
  error: any;
};

type ActionData = GenerateResponse | ConfirmPlanResponse | ErrorResponse;

export type GenerateFormData = {
  platform: "instagram" | string;
  template: "image" | string;
  productName: string;
  targetCustomer: string;
  coreCharacter: string;
};

function ChoiceButton({
  active,
  onClick,
  img,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  img: string;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: 14,
        borderRadius: 14,
        border: active ? "2px solid black" : "1px solid #ddd",
        background: active ? "#f2f2f2" : "white",
        cursor: "pointer",
      }}
    >
      <img src={img} />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </button>
  );
}

export default function CreatePostingPage({
  loaderData,
}: Route.ComponentProps) {
  const isMarketerExist = loaderData.marketer.length > 0;
  let aiId: number;
  const fetcher = useFetcher<ActionData>();
  const generateFetcher = useFetcher<ActionData>();
  const confirmFetcher = useFetcher<ActionData>();
  const regenerateFetcher = useFetcher<ActionData>();
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<Payload>({
    platform: null,
    template: null,
    requestForm: null,
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);

  const [preview, setPreview] = useState<PostingResponse | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [lastGenerateForm, setLastGenerateForm] =
    useState<GenerateFormData | null>(null);

  const { env } = useLoaderData<typeof loader>();
  const supabase = useMemo(() => {
    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }, [env.SUPABASE_URL, env.SUPABASE_ANON_KEY]);

  useEffect(() => {
    const data = fetcher.data as ActionData | undefined;
    if (!data || !data.ok) return;
    if (data.intent === "generate") {
      setLastGenerateForm(data.formData);
      setPreview(data.preview);
      setRequestId(data.requestId);
    }
    if (data.intent !== "confirm" || data.stage !== "plan") return;
    if (!preview || requestId == null) return;

    if (typeof requestId !== "number" || Number.isNaN(requestId)) return;
    console.log("confirm actions response: ", data);

    (async () => {
      const { bucket, targets } = data as {
        bucket: string;
        targets: Array<{ order: number; path: string; token: string }>;
      };

      for (const t of targets) {
        const file = selectedFiles[t.order];
        const { error } = await supabase.storage
          .from(bucket)
          .uploadToSignedUrl(t.path, t.token, file, {
            contentType: file.type,
            upsert: false,
          });

        if (error) throw error;
      }
      const urls = targets.map(
        (t) =>
          supabase.storage.from(bucket).getPublicUrl(t.path).data.publicUrl,
      );

      // public urls
      setUploadUrls(urls);

      const formData = new FormData();
      formData.append("intent", "confirm");
      formData.append("stage", "finalize");
      formData.append("requestId", String(requestId));
      formData.append("title", preview.title);
      formData.append("text", preview.text);
      formData.append("hashtags", JSON.stringify(preview.hashtags));
      formData.append("imageUrls", JSON.stringify(urls));

      fetcher.submit(formData, { method: "post" });
      console.log("This is upload urls", uploadUrls);
    })().catch((e) => {});
    return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [fetcher.data, selectedFiles, supabase, preview, requestId]);

  const onFileChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles(files);
    setPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return files.map((f) => URL.createObjectURL(f));
    });
    setUploadUrls([]);
    setPayload((p) => ({
      ...p,
      requestForm: {
        files, // ✅ 여기로 넣기
        productName: p.requestForm?.productName || "",
        targetCustomer: p.requestForm?.targetCustomer || "",
        coreCharacter: p.requestForm?.coreCharacter || "",
      },
    }));
  };

  if (isMarketerExist) {
    aiId = loaderData.marketer[0].ai_id;
  }

  const isFormComplete =
    payload.requestForm?.files &&
    payload.requestForm?.productName &&
    payload.requestForm?.targetCustomer &&
    payload.requestForm?.coreCharacter;

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // 생성하기 submit
  const handleGenerate = () => {
    if (!payload.platform || !payload.template || !payload.requestForm) return;

    const formData = new FormData();
    formData.append("intent", "generate");
    formData.append("platform", payload.platform);
    formData.append("template", payload.template);
    // Array.from(payload.requestForm.files || []).forEach((file) => {
    //   formData.append("files", file);
    // });
    formData.append("productName", payload.requestForm.productName);
    formData.append("targetCustomer", payload.requestForm.targetCustomer);
    formData.append("coreCharacter", payload.requestForm.coreCharacter);
    formData.append("aiId", String(aiId));

    fetcher.submit(formData, { method: "post" });
  };

  // 확정하기 submit
  const handleConfirm = () => {
    if (!preview || requestId == null) return;
    if (selectedFiles.length === 0) return;

    const fileMeta = selectedFiles.map((f) => ({
      name: f.name,
      type: f.type,
      size: f.size,
    }));

    const formData = new FormData();
    formData.append("intent", "confirm");
    formData.append("stage", "plan");
    formData.append("requestId", String(requestId));
    formData.append("title", preview.title);
    formData.append("text", preview.text);
    formData.append("hashtags", JSON.stringify(preview.hashtags));
    formData.append("fileMeta", JSON.stringify(fileMeta));

    fetcher.submit(formData, { method: "post" });
  };

  // 재생성하기 submit
  const handleRegenerate = () => {
    if (!lastGenerateForm || requestId === null) return;

    const formData = new FormData();
    formData.append("intent", "regenerate");
    formData.append("platform", lastGenerateForm.platform);
    formData.append("template", lastGenerateForm.template);
    formData.append("productName", lastGenerateForm.productName);
    formData.append("targetCustomer", lastGenerateForm.targetCustomer);
    formData.append("coreCharacter", lastGenerateForm.coreCharacter);
    formData.append("requestId", String(requestId));

    fetcher.submit(formData, { method: "post" });
  };

  // 생성 성공 시 Step 4로 이동
  const hasPreview = fetcher.data?.ok && preview;
  if (hasPreview && step === 3) {
    setStep(4);
  }

  const progress = [
    { step: 1, text: "플랫폼 선택" },
    { step: 2, text: "템플릿 선택" },
    { step: 3, text: "컨텐츠 작성" },
    { step: 4, text: "확인 & 저장" },
  ];

  const submitting = fetcher.state !== "idle";
  return (
    <div className="p-20 space-y-10">
      {isMarketerExist ? (
        <>
          <header className="flex justify-between">
            <div className="space-y-3">
              <h1 className="font-extrabold text-4xl">새 포스팅 생성</h1>
              <p className="text-lg text-gray-500">
                기업 정보를 기반으로 소셜 미디어 포스팅을 자동으로 생성합니다.
              </p>
            </div>
            <div className="space-x-2.5">
              <Button className="p-6" asChild>
                <Link to={"/dashboard"}>
                  <LayoutDashboard />
                  대시보드
                </Link>
              </Button>
              <Button className="p-6" asChild>
                <Link to={"/contents"}>
                  <ArrowLeft />
                  목록으로
                </Link>
              </Button>
            </div>
          </header>
          <main className="space-y-10">
            {/* Progress */}
            <div className="flex justify-around shadow-2xl border rounded-2xl p-[50px]">
              {progress.map((n) => (
                <div key={n.step} className="flex flex-col items-center">
                  <div
                    className={`w-[50px] h-[50px] rounded-[50%] ${n.step <= step ? "bg-primary" : "bg-gray-400"} border-2 border-black flex flex-col justify-center text-center`}
                  >
                    <p className="font-bold text-white">{n.step}</p>
                  </div>
                  <p>{n.text}</p>
                </div>
                // <div
                //   key={n.step}
                //   style={{
                //     flex: 1,
                //     height: 8,
                //     borderRadius: 999,
                //     background: n.step <= step ? "black" : "#e5e5e5",
                //     opacity: n.step <= step ? 1 : 0.6,
                //   }}
                //   />
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <section className="space-y-10 shadow-2xl border rounded-2xl p-[50px]">
                <div className="space-y-3">
                  <h2 className="font-extrabold text-3xl">플랫폼 선택</h2>
                  <p className="text-lg text-gray-500">
                    포스팅할 플랫폼을 선택하세요
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ChoiceButton
                    active={payload.platform === "instagram"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, platform: "instagram" }))
                    }
                    img=""
                    title="인스타그램"
                    description="이미지 중심의 짧은 컨텐츠"
                  />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={next}
                    disabled={payload.platform === null}
                    className="p-8 text-lg"
                  >
                    다음 단계 <ArrowRight />
                  </Button>
                </div>
              </section>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <section className="space-y-10">
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 600 }}>템플릿 선택</h2>
                  <p>포스팅 스타일에 맞는 템플릿을 선택하세요</p>
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <ChoiceButton
                    active={payload.template === "basic"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "basic" }))
                    }
                    img=""
                    title="기본 포맷"
                    description="간단하고 깔끔한 기본 포스팅 형식"
                  />
                  <ChoiceButton
                    active={payload.template === "list"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "list" }))
                    }
                    img=""
                    title="리스트형"
                    description="정보를 리스트로 정리한 실용적인 포맷"
                  />
                  <ChoiceButton
                    active={payload.template === "image"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "image" }))
                    }
                    img=""
                    title="이미지 중심"
                    description="이미지를 강조한 시각적인 포스팅"
                  />
                  <ChoiceButton
                    active={payload.template === "question"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "question" }))
                    }
                    img=""
                    title="질문형"
                    description="질문으로 시작해서 참여를 유도하는 포맷"
                  />
                  <ChoiceButton
                    active={payload.template === "tip-knowhow"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "tip-knowhow" }))
                    }
                    img=""
                    title="팁 & 노하우"
                    description="실용적인 팁과 노하우를 전달하는 포맷"
                  />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={back}
                    disabled={false}
                    variant={"secondary"}
                    className="p-6"
                  >
                    이전
                  </Button>
                  <Button
                    type="button"
                    onClick={next}
                    disabled={payload.template === null}
                    variant={"secondary"}
                    className="p-6"
                  >
                    다음 <ArrowRight />
                  </Button>
                </div>
              </section>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <section className="space-y-10 shadow-2xl border rounded-2xl p-[50px]">
                <div className="space-y-3">
                  <h2 className="font-extrabold text-3xl">컨텐츠 작성</h2>
                  <p className="text-lg text-gray-500">
                    포스팅에 필요한 세부 정보를 입력하세요
                  </p>
                </div>

                <Form method="post" encType="multipart/form-data">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="files">이미지 업로드</Label>
                      {previewUrls && (
                        <div className="flex gap-3">
                          {previewUrls.map((item, index) => (
                            <div className="size-70 overflow-hidden rounded-3xl">
                              <img
                                src={item}
                                key={"preview" + index}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <Input
                        id="files"
                        name="files"
                        placeholder="파일 선택"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onFileChanges}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productName">제품/서비스명</Label>
                      <Input
                        id="productName"
                        name="productName"
                        type="text"
                        placeholder="제품/서비스명을 입력하세요"
                        className="p-6"
                        onChange={(e) =>
                          setPayload((p) => ({
                            ...p,
                            requestForm: {
                              ...p.requestForm,
                              files: p.requestForm?.files || null,
                              productName: e.target.value,
                              targetCustomer:
                                p.requestForm?.targetCustomer || "",
                              coreCharacter: p.requestForm?.coreCharacter || "",
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetCustomer">타겟 고객층</Label>
                      <Input
                        id="targetCustomer"
                        name="targetCustomer"
                        type="text"
                        placeholder="예: 20-30대 직장인, 학생 등"
                        className="p-6"
                        onChange={(e) =>
                          setPayload((p) => ({
                            ...p,
                            requestForm: {
                              ...p.requestForm,
                              files: p.requestForm?.files || null,
                              productName: p.requestForm?.productName || "",
                              targetCustomer: e.target.value,
                              coreCharacter: p.requestForm?.coreCharacter || "",
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coreCharacter">핵심 특징</Label>
                      <textarea
                        name="coreCharacter"
                        id="coreCharacter"
                        onChange={(e) =>
                          setPayload((p) => ({
                            ...p,
                            requestForm: {
                              ...p.requestForm,
                              files: p.requestForm?.files || null,
                              productName: p.requestForm?.productName || "",
                              targetCustomer:
                                p.requestForm?.targetCustomer || "",
                              coreCharacter: e.target.value,
                            },
                          }))
                        }
                        placeholder={`제품/서비스의 핵심 특징을 입력하세요. ex)\n- 직접 로스팅한 원두 사용\n- 조용해서 혼자 작업하기 좋음\n- 디저트는 매일 직접 만듦`}
                        rows={6}
                        className="w-full border-2 rounded-lg p-4"
                      />
                    </div>
                  </div>
                </Form>

                <Separator />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={back}
                    variant={"secondary"}
                    className="p-6"
                  >
                    <ArrowLeft /> 이전
                  </Button>
                  <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!isFormComplete || submitting}
                    className="p-6"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        포스팅 생성하기 <ArrowRight />
                      </>
                    )}
                  </Button>
                </div>

                {fetcher.data?.ok === false && (
                  <p className="text-red-500 text-center">
                    {fetcher.data.error || "전송에 실패했습니다."}
                  </p>
                )}
              </section>
            )}

            {/* Step 4 - 프리뷰 */}
            {step === 4 && preview && (
              <section className="space-y-10 shadow-2xl border rounded-2xl p-[50px]">
                <div className="space-y-3">
                  <h2 className="font-extrabold text-3xl">생성 결과 확인</h2>
                  <p className="text-lg text-gray-500">
                    AI가 생성한 포스팅을 확인하고 저장하거나 재생성하세요
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* 이미지 프리뷰 */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl">이미지</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {previewUrls?.map((url, idx) => (
                        <img
                          key={"uploaded-imgs" + idx}
                          src={url}
                          alt={`uploaded-${idx}`}
                          className="w-full h-40 object-cover rounded-lg border"
                        />
                      ))}
                      {(!previewUrls || previewUrls.length === 0) && (
                        <p className="text-gray-400">
                          업로드된 이미지가 없습니다
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 텍스트 프리뷰 */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xl">포스팅 내용</h3>
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">제목</p>
                        <p className="font-semibold text-lg">{preview.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">본문</p>
                        <p className="whitespace-pre-wrap">{preview.text}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">해시태그</p>
                        <p className="text-blue-600">
                          {preview.hashtags.join(" ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={back}
                    variant={"secondary"}
                    className="p-6"
                  >
                    <ArrowLeft /> 다시 입력
                  </Button>
                  <div className="space-x-3">
                    <Button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={submitting}
                      variant={"outline"}
                      className="p-6"
                    >
                      {submitting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <RefreshCw />
                      )}
                      재생성
                    </Button>
                    <Button
                      type="button"
                      onClick={handleConfirm}
                      disabled={submitting}
                      className="p-6"
                    >
                      {submitting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Check />
                      )}
                      확정하고 저장
                    </Button>
                  </div>
                </div>
              </section>
            )}
          </main>
        </>
      ) : (
        <>
          <h1>마케터가 없습니다. 먼저 마케터를 생성해주세요.</h1>
          <div>
            <Button asChild>
              <Link to={"/dashboard"}>돌아가기</Link>
            </Button>
            <Button asChild>
              <Link to={"/marketer/create"}>마케터 생성하기</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
