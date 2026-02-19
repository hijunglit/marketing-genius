import { ArrowLeftIcon, LoaderCircle, LogInIcon } from "lucide-react";
import { data, Form, Link, redirect, useNavigation } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { z } from "zod";
import type { Route } from "./+types/login-page";
import { makeSSRClient } from "~/supa-client";
import AuthButtons from "../components/auth-button";

const formSchema = z.object({
  email: z
    .string({
      required_error: "이메일을 입력해주세요.",
      invalid_type_error: "이메일 형식이 올바르지 않습니다.",
    })
    .email("유효하지 않은 이메일 입니다."),
  password: z
    .string({
      required_error: "비밀번호를 입력해주세요",
    })
    .min(8, {
      message: "비밀번호는 8자리 이상이어야 합니다.",
    }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!success) {
    return {
      loginErrors: null,
      formErrors: error.flatten().fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    return {
      formErrors: null,
      loginError: loginError.message,
    };
  }
  return redirect("/dashboard", { headers });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (user) return redirect("/dashboard");
};

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white">
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-lenear  -to-b from-white via-white to-slate-50" />
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="absolute -bottom-60 -left-40 h-[620px] w-[620px] rounded-full bg-sky-200/70 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>
      <Card className="relative w-full max-w-2xl p-8 mx-auto border-slate-200/70 bg-white/80 backdrop-blur shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
        <CardHeader className="text-center">
          <CardTitle className="text-black">로그인</CardTitle>
          <CardDescription>계정에 로그인하여 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black">
                  이메일 주소
                </Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
                {actionData && "formErrors" in actionData && (
                  <p className="text-sm text-red-500">
                    {actionData?.formErrors?.email?.join(", ")}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black">
                  비밀번호
                </Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              {actionData && "formErrors" in actionData && (
                <p className="text-sm text-red-500">
                  {actionData?.formErrors?.password?.join(", ")}
                </p>
              )}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    <LogInIcon />
                    로그인
                  </>
                )}
              </Button>
              {actionData && "loginError" in actionData && (
                <p className="text-sm text-red-500">{actionData.loginError}</p>
              )}
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div>
            <span></span>
            <span className="text-black">또는</span>
            <span></span>
          </div>
          <AuthButtons />
          <div className="flex items-center">
            <span className="text-black">계정이 없으신가요?</span>
            <CardAction>
              <Button variant="link">
                <Link to={"/auth/join"}>회원가입</Link>
              </Button>
            </CardAction>
          </div>
          <div className="flex">
            <ArrowLeftIcon color="white" />
            <Link to={"/"} className="text-black">
              홈으로 돌아가기
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
