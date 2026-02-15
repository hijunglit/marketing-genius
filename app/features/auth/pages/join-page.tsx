import { ArrowLeftIcon, LoaderCircle, LogInIcon, PlusIcon } from "lucide-react";
import { Form, Link, redirect, useNavigation } from "react-router";
import z from "zod";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import type { Route } from "./+types/join-page";
import { makeSSRClient } from "~/supa-client";
import { checkUsernameExists } from "../queries";

const formSchema = z.object({
  name: z.string().min(2).max(20),
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!success) {
    return {
      formErrors: error.flatten().fieldErrors,
    };
  }
  const usernameExists = await checkUsernameExists(request, {
    username: data.username,
  });
  if (usernameExists) {
    return {
      formErrors: { username: ["이미 존재하는 닉네임 입니다."] },
    };
  }
  const { client, headers } = makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        username: data.username,
      },
    },
  });
  if (signUpError) {
    return {
      signUpError: signUpError.message,
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

export default function join({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white">
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-lenear-to-b from-white via-white to-slate-50" />
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
        <CardHeader>
          <CardTitle className="text-black">회원가입</CardTitle>
          <CardDescription>새 계정을 만들어 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-black">
                이름
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="이름을 입력하세요"
                required
              />
              {actionData && "formErrors" in actionData && (
                <p className="text-sm text-red-500">
                  {actionData.formErrors?.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="username" className="text-black">
                닉네임
              </label>
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="닉네임을 입력하세요"
                required
              />
              {actionData && "formErrors" in actionData && (
                <p className="text-sm text-red-500">
                  {actionData?.formErrors?.username}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label htmlFor="email" className="text-black">
                이메일
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                required
              />
              {actionData && "formErrors" in actionData && (
                <p className="text-sm text-red-500">
                  {actionData?.formErrors?.email}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label htmlFor="password" className="text-black">
                비밀번호
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="8자 이상 입력하세요"
                required
              />
              {actionData && "formErrors" in actionData && (
                <p className="text-sm text-red-500">
                  {actionData?.formErrors?.password}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full col-span-2 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <LogInIcon />
                  회원가입
                </>
              )}
            </Button>
            {actionData && "signUpError" in actionData && (
              <p className="text-sm text-red-500">{actionData.signUpError}</p>
            )}
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div>
            <span></span>
            <span className="text-black">또는</span>
            <span></span>
          </div>
          <Button variant="outline" className="w-full">
            Google로 회원가입
          </Button>
          <div className="flex items-center">
            <span className="text-black">이미 계정이 있으신가요?</span>
            <Button variant="link">
              <Link to={"/auth/login"}>로그인</Link>
            </Button>
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
