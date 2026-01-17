import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { Form, Link } from "react-router";
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

export default function join() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <Card className="w-full max-w-2xl p-8">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>새 계정을 만들어 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name">이름</label>
              <Input
                type="text"
                id="name"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div>
              <label htmlFor="email">이메일</label>
              <Input
                type="email"
                id="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password">비밀번호</label>
              <Input
                type="password"
                id="password"
                placeholder="8자 이상 입력하세요"
                required
              />
            </div>
            <div>
              <label htmlFor="check_password">비밀번호 확인</label>
              <Input
                type="password"
                id="check_password"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>
            <Button type="submit" className="w-full col-span-2" asChild>
              <Link to={"/join"}>
                <PlusIcon />
                회원가입
              </Link>
            </Button>
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
