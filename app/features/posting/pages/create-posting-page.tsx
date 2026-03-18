import type { Route } from "./+types/create-posting-page";
import { Button } from "~/common/components/ui/button";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
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
  Instagram,
  ClipboardList,
  ScrollText,
  BadgeQuestionMark,
  Lightbulb,
  X,
  TriangleAlert,
  CheckIcon,
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
import { Textarea } from "~/common/components/ui/textarea";
import { useIsMobile } from "~/hooks/use-mobile";

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
  platform: z.enum(PLATFORM_TYPE as [string, ...string[]]),
  template: z.enum(TEMPLATE_TYPE as [string, ...string[]]),
  productName: z.string(),
  targetCustomer: z.string(),
  coreCharacter: z.string(),
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
        if (fileMeta.length === 0) {
          return { ok: false, error: "이미지는 필수입니다." };
        }

        const totalFileSize = fileMeta.reduce((acc, cur) => acc + cur.size, 0);
        const maxSize = 10_971_520; // ~20MB
        if (totalFileSize > maxSize) {
          return {
            ok: false,
            error: `총 이미지 용량이 10MB를 초과합니다. (현재: ${(totalFileSize / 1024 / 1024).toFixed(2)}MB)`,
          };
        }
        const invalidFile = fileMeta.find((f) => !f.type.startsWith("image/"));
        if (invalidFile) {
          return {
            ok: false,
            error: `지원하지 않는 파일 형식입니다: ${invalidFile.name}`,
          };
        }

        const bucket = "posting-images";
        const targets = await Promise.all(
          fileMeta.map(async (file, order) => {
            const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
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
  platform: "instagram" | "blog" | null;
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

type RegenerateResponse = {
  ok: true;
  intent: "regenerate";
  preview: PostingResponse;
  requestId: number;
  formData: GenerateFormData;
};

type ErrorResponse = {
  ok: false;
  error: any;
};

type ActionData =
  | GenerateResponse
  | ConfirmPlanResponse
  | RegenerateResponse
  | ErrorResponse;

export type GenerateFormData = {
  platform: "instagram" | "blog" | string;
  template: "image" | string;
  productName: string;
  targetCustomer: string;
  coreCharacter: string;
};

const MAX_IMAGE_SIZE_BYTES = 10_971_520; // ~10MB

function validateImageFiles(files: File[]): string | null {
  if (files.length === 0) return "이미지는 필수입니다.";
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  if (totalSize > MAX_IMAGE_SIZE_BYTES) {
    return `총 이미지 용량이 10MB를 초과합니다. (현재: ${(totalSize / 1024 / 1024).toFixed(2)}MB)`;
  }
  const invalidFile = files.find((f) => !f.type.startsWith("image/"));
  if (invalidFile) {
    return `지원하지 않는 파일 형식입니다: ${invalidFile.name}`;
  }
  return null;
}

function ChoiceButton({
  active,
  onClick,
  icon,
  title,
  description,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  title: string;
  description: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-5"
      disabled={disabled}
      style={{
        textAlign: "left",
        padding: 18,
        borderRadius: 14,
        border: active ? "2px solid black" : "1px solid #ddd",
        background: active ? "#f2f2f2" : "white",
        cursor: "pointer",
      }}
    >
      <p className="text-2xl lg:text-5xl text-gray-400">{icon}</p>
      <div>
        <h3 className="font-bold text-sm lg:text-lg">{title}</h3>
        <p className="text-xs lg:text-sm text-gray-400">{description}</p>
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
  const [fileValidationError, setFileValidationError] = useState<string | null>(
    null,
  );
  const [preHashtag, setPreHashtag] = useState("");
  const [preview, setPreview] = useState<PostingResponse | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [lastGenerateForm, setLastGenerateForm] =
    useState<GenerateFormData | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  const { env } = useLoaderData<typeof loader>();
  const supabase = useMemo(() => {
    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }, [env.SUPABASE_URL, env.SUPABASE_ANON_KEY]);

  // generate/regenerate 응답 시에만 preview 초기화 (사용자 수정 내용 덮어쓰기 방지)
  useEffect(() => {
    const data = fetcher.data as ActionData | undefined;
    if (!data || !data.ok) return;
    if (data.intent === "generate") {
      setLastGenerateForm(data.formData);
      setPreview(data.preview);
      setRequestId(data.requestId);
    }
    if (data.intent === "regenerate") {
      setPreview(data.preview);
    }
  }, [fetcher.data]);

  // confirm stage=plan 응답 시 이미지 업로드 후 finalize 제출
  useEffect(() => {
    const data = fetcher.data as ActionData | undefined;
    if (!data || !data.ok || data.intent !== "confirm" || data.stage !== "plan")
      return;
    if (!preview || requestId == null) return;
    if (typeof requestId !== "number" || Number.isNaN(requestId)) return;

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
    })().catch((e) => {});
    // preview는 confirm 응답 시점의 값 사용 (의존성 제외로 중복 업로드 방지)
  }, [fetcher.data, selectedFiles, supabase, requestId]);

  const onFileChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const error = validateImageFiles(files);
    setFileValidationError(error);
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

  const handleDeleteImage = (index: number) => {
    setPreviewUrls(previewUrls.filter((url) => url !== previewUrls[index]));
    setSelectedFiles(
      selectedFiles.filter((file) => file !== selectedFiles[index]),
    );
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
    formData.append("productName", payload.requestForm.productName);
    formData.append("targetCustomer", payload.requestForm.targetCustomer);
    formData.append("coreCharacter", payload.requestForm.coreCharacter);
    formData.append("aiId", String(aiId));

    fetcher.submit(formData, { method: "post" });
  };

  // 확정하기 submit
  const handleConfirm = () => {
    if (!preview || requestId == null) return;
    const validationError = validateImageFiles(selectedFiles);
    if (validationError) {
      setFileValidationError(validationError);
      return;
    }
    setFileValidationError(null);

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
    if (!lastGenerateForm || requestId === null || !isMarketerExist) return;

    const formData = new FormData();
    formData.append("intent", "regenerate");
    formData.append("platform", lastGenerateForm.platform);
    formData.append("template", lastGenerateForm.template);
    formData.append("productName", lastGenerateForm.productName);
    formData.append("targetCustomer", lastGenerateForm.targetCustomer);
    formData.append("coreCharacter", lastGenerateForm.coreCharacter);
    formData.append("aiId", String(aiId));

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
  const isMobile = useIsMobile();
  return (
    <div className="px-4 py-6 lg:p-20 space-y-4">
      {isMarketerExist ? (
        <>
          <header className="flex justify-between items-center">
            <div className="lg:space-y-3">
              <h1 className="text-xl lg:text-2xl font-extrabold">
                새 포스팅 생성
              </h1>
              <p className="hidden lg:block text-sm text-gray-500">
                기업 정보를 기반으로 소셜 미디어 포스팅을 자동으로 생성합니다.
              </p>
            </div>
            <div className="space-x-2.5">
              {isMobile ? (
                <>
                  <Button
                    className="w-[40px] h-[40px] rounded-[50%] bg-white border"
                    asChild
                  >
                    <Link to={"/dashboard"}>
                      <LayoutDashboard color="#000" />
                    </Link>
                  </Button>
                  <Button
                    className="w-[40px] h-[40px] rounded-[50%] bg-white border"
                    asChild
                  >
                    <Link to={"/contents"}>
                      <ArrowLeft color="#000" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </header>
          <main className="space-y-4 max-w-7xl">
            {/* Progress */}
            <div className="flex justify-around shadow-2xl border rounded-2xl p-[10px] lg:p-[50px]">
              {progress.map((n) => (
                <div
                  key={n.step}
                  className="flex flex-col items-center space-y-2"
                >
                  <div
                    className={`w-[32px] h-[32px] lg:w-[50px] lg:h-[50px] rounded-[50%] ${n.step <= step ? "bg-primary border-x-purple-200" : "bg-white"} border-2 flex flex-col justify-center text-center`}
                  >
                    <span
                      className={`font-bold ${n.step == step ? "text-white" : "text-gray-300"}`}
                    >
                      {`${n.step < step ? "✓" : n.step}`}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-bold ${n.step <= step ? "text-violet-600" : "text-gray-300"}`}
                  >
                    {n.text}
                  </p>
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
              <section className="space-y-4 lg:space-y-10 shadow-2xl border rounded-2xl p-[20px] lg:p-[50px]">
                <div className="lg:space-y-3">
                  <h2 className="font-bold text-base lg:text-2xl">
                    플랫폼 선택
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-500">
                    포스팅할 플랫폼을 선택하세요
                  </p>
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                  <ChoiceButton
                    active={payload.platform === "instagram"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, platform: "instagram" }))
                    }
                    icon="📷"
                    title="인스타그램"
                    description="이미지 중심의 짧은 컨텐츠"
                  />
                  <ChoiceButton
                    active={payload.platform === "blog"}
                    disabled
                    onClick={() =>
                      setPayload((p) => ({ ...p, platform: "blog" }))
                    }
                    icon="📄"
                    title="블로그"
                    description="서비스 준비중입니다..."
                  />
                </div>
                {payload.platform == null && (
                  <div className="w-full bg-amber-200 p-1.5 text-xs">
                    <div className="w-px h-full bg-amber-600"></div>

                    <span className="text-amber-900 font-medium">
                      <TriangleAlert size={18} className="inline pr-1" />
                      플랫폼을 선택해주세요
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={next}
                    disabled={payload.platform === null}
                    className={`${payload.platform === null ? "bg-gray-400" : "bg-primary"}lg:p-8 lg:text-lg`}
                  >
                    다음 단계 <ArrowRight />
                  </Button>
                </div>
              </section>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <section className="space-y-4 lg:space-y-10 shadow-2xl border rounded-2xl p-[20px] lg:p-[50px]">
                <div>
                  <h2 className="font-bold text-base lg:text-2xl">
                    템플릿 선택
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-500">
                    포스팅 스타일에 맞는 템플릿을 선택하세요
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-2 lg:gap-5">
                  <ChoiceButton
                    active={payload.template === "basic"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "basic" }))
                    }
                    icon={<ScrollText size={34} />}
                    title="기본 포맷"
                    description="간단하고 깔끔한 기본 포스팅 형식"
                  />
                  <ChoiceButton
                    active={payload.template === "list"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "list" }))
                    }
                    icon={<ClipboardList size={34} />}
                    title="리스트형"
                    description="정보를 리스트로 정리한 실용적인 포맷"
                  />
                  <ChoiceButton
                    active={payload.template === "question"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "question" }))
                    }
                    icon={<BadgeQuestionMark size={34} />}
                    title="질문형"
                    description="질문으로 시작해서 참여를 유도하는 포맷"
                  />
                  <ChoiceButton
                    active={payload.template === "tip-knowhow"}
                    onClick={() =>
                      setPayload((p) => ({ ...p, template: "tip-knowhow" }))
                    }
                    icon={<Lightbulb />}
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
                    className="p-4 lg:p-6 bg-white border-gray-400 border"
                  >
                    이전
                  </Button>
                  <Button
                    type="button"
                    onClick={next}
                    disabled={payload.template === null}
                    variant={"secondary"}
                    className="p-4 lg:p-6 bg-primary text-white"
                  >
                    다음 <ArrowRight />
                  </Button>
                </div>
              </section>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <section className="space-y-4 lg:space-y-10 shadow-2xl border rounded-2xl p-[20px] lg:p-[50px]">
                <div className="space-y-3">
                  <h2 className="font-bold text-base lg:text-2xl">
                    컨텐츠 작성
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-500">
                    포스팅에 필요한 세부 정보를 입력하세요
                  </p>
                </div>
                <Form method="post" encType="multipart/form-data">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="files" className="text-xs lg:text-sm">
                        이미지 업로드
                      </Label>
                      {previewUrls && (
                        <div className="grid grid-cols-4 gap-4">
                          {previewUrls.map((item, index) => (
                            <div
                              key={"preview-ctn" + index}
                              className="relative w-2xs rounded-3xl overflow-hidden border border-gray-200"
                            >
                              <div
                                className="absolute right-2 top-2 z-9 bg-red-600 w-[35px] h-[35px] rounded-[50%] flex flex-col justify-center cursor-pointer"
                                onClick={() => handleDeleteImage(index)}
                              >
                                <X className="m-auto" color="white" />
                              </div>
                              <img
                                src={item}
                                className="object-cover w-full h-32 hover:scale-110 transition-all"
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
                      {fileValidationError && (
                        <p className="text-sm text-red-500">
                          {fileValidationError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="productName"
                        className="text-xs lg:text-sm"
                      >
                        제품/서비스명
                      </Label>
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
                      <Label
                        htmlFor="targetCustomer"
                        className="text-xs lg:text-sm"
                      >
                        타겟 고객층
                      </Label>
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
                      <Label
                        htmlFor="coreCharacter"
                        className="text-xs lg:text-sm"
                      >
                        핵심 특징
                      </Label>
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
                    disabled={
                      !isFormComplete || submitting || !!fileValidationError
                    }
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
              <section className="space-y-4 lg:space-y-10 shadow-2xl border rounded-2xl p-[20px] lg:p-[50px]">
                <div className="space-y-3">
                  <h2 className="font-bold text-base lg:text-2xl">
                    생성 결과 확인
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-500">
                    AI가 생성한 포스팅을 확인하고 저장하거나 재생성하세요
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* 이미지 프리뷰 */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-base lg:text-2xl">이미지</h3>
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
                    <Form className="space-y-4">
                      <h3 className="font-bold text-base lg:text-2xl">
                        포스팅 내용
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label
                            className="text-sm text-gray-500"
                            htmlFor="title"
                          >
                            제목
                          </Label>
                          <Input
                            id="title"
                            name="title"
                            type="text"
                            value={preview.title}
                            className="font-semibold text-lg"
                            onChange={(e) =>
                              setPreview((p) => ({
                                title: e.target.value,
                                text: p?.text || "",
                                hashtags: p?.hashtags || [""],
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="text"
                            className="text-sm text-gray-500"
                          >
                            본문
                          </label>
                          <Textarea
                            id="text"
                            name="text"
                            value={preview.text}
                            className="whitespace-pre-wrap"
                            onChange={(e) =>
                              setPreview((p) => ({
                                ...p,
                                title: p?.title || "",
                                text: e.target.value,
                                hashtags: p?.hashtags || [""],
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-500">해시태그</p>
                          <div className="flex gap-1">
                            {/* A spread argument must either have a tuple type or
                            be passed to a rest parameter. */}
                            <Input
                              id="sethashtags"
                              name="sethashtags"
                              placeholder="# 해시태그 입력 후 엔터"
                              value={preHashtag}
                              onChange={(e) => {
                                setPreHashtag(e.currentTarget.value);
                              }}
                              onCompositionStart={() => setIsComposing(true)}
                              onCompositionEnd={() => setIsComposing(false)}
                              onKeyDown={(
                                e: KeyboardEvent<HTMLInputElement>,
                              ) => {
                                if (isComposing) return;
                                const keyname = e.key;
                                if (keyname === "Enter") {
                                  if (preHashtag.length === 0) return;
                                  while (0) {
                                    setPreview({
                                      ...preview,
                                      hashtags: [
                                        ...preview.hashtags,
                                        preHashtag.startsWith("#")
                                          ? preHashtag
                                          : "#" + preHashtag,
                                      ],
                                    });
                                    setPreHashtag("");
                                  }
                                }
                              }}
                            />
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                if (preHashtag.length === 0) return;
                                setPreview({
                                  ...preview,
                                  hashtags: [
                                    ...preview.hashtags,
                                    preHashtag.startsWith("#")
                                      ? preHashtag
                                      : "#" + preHashtag,
                                  ],
                                });
                                setPreHashtag("");
                              }}
                              className="cursor-pointer"
                            >
                              추가
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1 w-full bg-gray-100 rounded-2xl space-y-1 p-2">
                            {preview.hashtags.map((hashtag, idx) => (
                              <div
                                key={hashtag + idx}
                                className="flex items-center bg-white size-fit rounded-lg p-px border-y-blue-200 border"
                              >
                                <p className="text-blue-600 text-xs lg:text-sm">
                                  {hashtag}
                                </p>
                                <Button
                                  variant={"ghost"}
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPreview({
                                      ...preview,
                                      hashtags: preview.hashtags.filter(
                                        (i) =>
                                          i !==
                                          e.currentTarget.previousSibling
                                            ?.textContent,
                                      ),
                                    });
                                  }}
                                >
                                  <X color="#155dfc" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
                {fetcher.data?.ok === false && (
                  <p className="text-red-500 text-center">
                    {fetcher.data.error || "전송에 실패했습니다."}
                  </p>
                )}
                {fileValidationError && (
                  <p className="text-red-500 text-center">
                    {fileValidationError}
                  </p>
                )}
                <Separator />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={back}
                    variant={"secondary"}
                    className="lg:p-6 cursor-pointer"
                  >
                    이전
                  </Button>
                  <div className="space-x-3 flex">
                    <Button
                      type="button"
                      onClick={handleRegenerate}
                      disabled={submitting}
                      variant={"outline"}
                      className="lg:p-6"
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
                      disabled={submitting || !!fileValidationError}
                      className="lg:p-6"
                    >
                      {submitting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : null}
                      저장
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
