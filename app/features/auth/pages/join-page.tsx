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
  name: z.string().min(2).max(4),
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
        name: data.username,
        username: data.password,
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

export default function join({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="h-screen flex flex-col justify-center">
      <Card className="w-full max-w-2xl p-8">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>새 계정을 만들어 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name">이름</label>
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
              <label htmlFor="username">닉네임</label>
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
              <label htmlFor="email">이메일</label>
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
            <div>
              <label htmlFor="password">비밀번호</label>
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
            <div>
              <label htmlFor="check_password">비밀번호 확인</label>
              <Input
                type="password"
                id="check_password"
                name="check_password"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full col-span-2"
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
            <span>또는</span>
            <span></span>
          </div>
          <Button variant="outline" className="w-full">
            Google로 회원가입
          </Button>
          <div className="flex items-center">
            <span>이미 계정이 있으신가요?</span>
            <Button variant="link">
              <Link to={"/auth/login"}>로그인</Link>
            </Button>
          </div>
          <div className="flex">
            <ArrowLeftIcon />
            <Link to={"/"}>홈으로 돌아가기</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
