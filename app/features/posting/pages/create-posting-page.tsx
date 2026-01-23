import type { Route } from "./+types/create-posting-page";
import { Button } from "~/common/components/ui/button";
import { useState } from "react";
import { useFetcher } from "react-router";
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

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create Posting" }];
}

type Payload = {
  platform: "blog" | "instagram" | null;
  template: "basic" | "list" | "image" | "question" | "tip-knowhow" | null;
  requestForm: {
    file: FormData | null;
    productName: string;
    targetCustomer: string;
    coreCharacter: string;
  } | null;
};

function ChoiceButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
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
      {label}
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
  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const submit = () => {
    // 마지막에만 서버로 한번에
    fetcher.submit({ payload: JSON.stringify(payload) }, { method: "post" });
  };

  const submitting = fetcher.state !== "idle";
  return (
    <div className="p-20 space-y-10">
      <header>
        <div>
          <h1>새 포스팅 생성</h1>
          <p>기업 정보를 기반으로 소셜 미디어 포스팅을 자동으로 생성합니다.</p>
        </div>
        <div>
          <Button>대시보드</Button>
          <Button>목록으로</Button>
        </div>
      </header>
      <main>
        {/* Progress */}
        <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                height: 8,
                borderRadius: 999,
                background: n <= step ? "black" : "#e5e5e5",
                opacity: n <= step ? 1 : 0.6,
              }}
            />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>목표를 선택하세요</h2>
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <ChoiceButton
                active={payload.platform === "blog"}
                onClick={() => setPayload((p) => ({ ...p, platform: "blog" }))}
                label="블로그"
              />
              <ChoiceButton
                active={payload.platform === "instagram"}
                onClick={() =>
                  setPayload((p) => ({ ...p, platform: "instagram" }))
                }
                label="인스타그램"
              />
            </div>

            <div>
              <button type="button" onClick={back} disabled={false}>
                이전
              </button>
              <button type="button" onClick={next} disabled={false}>
                다음
              </button>
            </div>
          </section>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>톤을 선택하세요</h2>
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <ChoiceButton
                active={payload.template === "basic"}
                onClick={() => setPayload((p) => ({ ...p, template: "basic" }))}
                label="기본 포맷"
              />
              <ChoiceButton
                active={payload.template === "list"}
                onClick={() => setPayload((p) => ({ ...p, template: "list" }))}
                label="리스트 스타일"
              />
              <ChoiceButton
                active={payload.template === "image"}
                onClick={() => setPayload((p) => ({ ...p, template: "image" }))}
                label="이미지 중심"
              />
              <ChoiceButton
                active={payload.template === "question"}
                onClick={() =>
                  setPayload((p) => ({ ...p, template: "question" }))
                }
                label="질문형"
              />
              <ChoiceButton
                active={payload.template === "tip-knowhow"}
                onClick={() =>
                  setPayload((p) => ({ ...p, template: "tip-knowhow" }))
                }
                label="팁 & 노하우"
              />
            </div>

            <div>
              <button type="button" onClick={back} disabled={false}>
                이전
              </button>
              <button type="button" onClick={next} disabled={false}>
                다음
              </button>
            </div>
          </section>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <section>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">세부사항 입력하기</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>세부사항 입력하기</AlertDialogTitle>
                </AlertDialogHeader>
                <div>
                  <textarea
                    onChange={(e) =>
                      setPayload((p) => ({ ...p, requestText: e.target.value }))
                    }
                    placeholder="예: 인스타용 포스팅 3개 써줘..."
                    rows={6}
                    style={{
                      width: "100%",
                      marginTop: 12,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      resize: "vertical",
                    }}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                    >
                      {submitting ? "생성중..." : "생성 완료"}
                    </button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div>
              <button type="button" onClick={back}>
                이전
              </button>
              <button
                type="button"
                onClick={next}
                disabled={fetcher.data?.ok === true ? false : true}
              >
                다음
              </button>
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
