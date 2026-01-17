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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const action = async ({ request }: Route.ActionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const formData = await request.formData();
  const { success, data } = formSchema.safeParse(Object.fromEntries(formData));
  return {
    message: "Error wrong password",
  };
};

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className="h-screen flex">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>로그인</CardTitle>
          <CardDescription>계정에 로그인하여 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    <LogInIcon />
                    로그인
                  </>
                )}
              </Button>
              {actionData?.message && (
                <p className="text-sm text-red-500">{actionData.message}</p>
              )}
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div>
            <span></span>
            <span>또는</span>
            <span></span>
          </div>
          <Button variant="outline" className="w-full">
            Google로 계속하기
          </Button>
          <div className="flex items-center">
            <span>계정이 없으신가요?</span>
            <CardAction>
              <Button variant="link">
                <Link to={"/auth/join"}>회원가입</Link>
              </Button>
            </CardAction>
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
