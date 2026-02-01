import type { Route } from "./+types/create-posting-page";
import { Button } from "~/common/components/ui/button";
import { useState } from "react";
import { Link, useFetcher } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/common/components/ui/alert-dialog";
import { Separator } from "~/common/components/ui/separator";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  LoaderCircle,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "포스팅 생성" }];
}

type Payload = {
  platform: "instagram" | null;
  template: "basic" | "list" | "image" | "question" | "tip-knowhow" | null;
  requestForm: {
    file: File | null;
    productName: string | null;
    targetCustomer: string | null;
    coreCharacter: string | null;
  } | null;
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

export default function CreatePostingPage({}: Route.ComponentProps) {
  const fetcher = useFetcher();
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<Payload>({
    platform: null,
    template: null,
    requestForm: null,
  });
  console.log(payload);
  const isNotComplete =
    payload.requestForm?.file === null ||
    payload.requestForm?.productName === null ||
    payload.requestForm?.targetCustomer === null ||
    payload.requestForm?.coreCharacter === null;
  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const submit = () => {
    // 마지막에만 서버로 한번에
    fetcher.submit({ payload: JSON.stringify(payload) }, { method: "post" });
  };

  const progress = [
    { step: 1, text: "플랫폼 선택" },
    { step: 2, text: "템플릿 선택" },
    { step: 3, text: "컨텐츠 작성" },
    { step: 4, text: "스케줄 설정" },
  ];

  const submitting = fetcher.state !== "idle";
  console.log(payload);
  return (
    <div className="p-20 space-y-10">
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
                onClick={() => setPayload((p) => ({ ...p, template: "basic" }))}
                img=""
                title="기본 포맷"
                description="간단하고 깔끔한 기본 포스팅 형식"
              />
              <ChoiceButton
                active={payload.template === "list"}
                onClick={() => setPayload((p) => ({ ...p, template: "list" }))}
                img=""
                title="스토리텔링"
                description="이야기 형식으로 풀어가는 감성적인 포스팅"
              />
              <ChoiceButton
                active={payload.template === "image"}
                onClick={() => setPayload((p) => ({ ...p, template: "image" }))}
                img=""
                title="리스트형"
                description="정보를 리스트로 정리한 실용적인 포맷"
              />
              <ChoiceButton
                active={payload.template === "question"}
                onClick={() =>
                  setPayload((p) => ({ ...p, template: "question" }))
                }
                img=""
                title="팁 & 노하우"
                description="실용적인 팁과 노하우를 전달하는 포맷"
              />
              <ChoiceButton
                active={payload.template === "tip-knowhow"}
                onClick={() =>
                  setPayload((p) => ({ ...p, template: "tip-knowhow" }))
                }
                img=""
                title="기본 포맷"
                description=""
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
          <section className="space-y-10">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">세부사항 입력하기</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>세부사항 입력하기</AlertDialogTitle>
                </AlertDialogHeader>
                <Separator />
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="file">파일 업로드</Label>
                    <Input
                      id="file"
                      name="file"
                      placeholder="파일 선택"
                      type="file"
                      accept="image/png, image/jpeg"
                      multiple
                      required
                      onChange={(e) =>
                        setPayload((p) => ({
                          ...p,
                          requestForm: {
                            ...p.requestForm,
                            file: e.target.files,
                          } as Payload["requestForm"],
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="productName">제품/서비스명</Label>
                    <Input
                      id="productName"
                      name="productName"
                      type="text"
                      placeholder="제품/서비스명을 입력하세요"
                      onChange={(e) =>
                        setPayload((p) => ({
                          ...p,
                          requestForm: {
                            ...p.requestForm,
                            productName: e.target.value,
                          } as Payload["requestForm"],
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetCustomer">타겟 고객층</Label>
                    <Input
                      id="targetCustomer"
                      name="targetCustomer"
                      type="text"
                      placeholder="예: 20-30대 직장인, 학생 등"
                      onChange={(e) =>
                        setPayload((p) => ({
                          ...p,
                          requestForm: {
                            ...p.requestForm,
                            targetCustomer: e.target.value,
                          } as Payload["requestForm"],
                        }))
                      }
                    />
                  </div>
                  <textarea
                    name="coreCharacter"
                    id="coreCharacter"
                    onChange={(e) =>
                      setPayload((p) => ({
                        ...p,
                        requestForm: {
                          ...p.requestForm,
                          coreCharacter: e.target.value,
                        } as Payload["requestForm"],
                      }))
                    }
                    placeholder="제품/서비스의 핵심 특징을 입력하세요. ex)&#13;- 직접 로스팅한 원두 사용&#13;- 조용해서 혼자 작업하기 좋음&#13;- 디저트는 매일 직접 만듦"
                    rows={6}
                    className="w-full border-2 rounded-lg"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction>
                    <Button type="button" onClick={submit} disabled={true}>
                      {submitting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "생성하기"
                      )}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Separator />
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={back}
                variant={"secondary"}
                className="p-6"
              >
                이전
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={fetcher.data?.ok === true ? false : true}
                variant={"secondary"}
                className="p-6"
              >
                다음
              </Button>
            </div>

            {fetcher.data?.ok === false && (
              <p style={{ marginTop: 12, color: "crimson" }}>
                전송에 실패했습니다.
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
