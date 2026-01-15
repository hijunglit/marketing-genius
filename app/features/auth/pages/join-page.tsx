import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export default function join() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>새 계정을 만들어 시작하세요</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" asChild>
            <Link to={"/join"}>
              <PlusIcon />
              회원가입
            </Link>
          </Button>
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
