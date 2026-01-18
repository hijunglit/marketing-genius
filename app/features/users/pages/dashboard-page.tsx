import {
  CardSimIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
} from "lucide-react";
import { data, isRouteErrorResponse, Link } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/common/components/ui/card";
import type { Route } from "./+types/dashboard-page";

export const loader = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return;
};

export default function Dashboard() {
  return (
    <div className="p-20">
      <header className="flex justify-between items-center">
        <div>
          <h1>대시보드</h1>
          <p>오늘의 마케팅 현황을 한 눈에 확인하세요.</p>
        </div>
        <div>
          <Button variant={"outline"}>
            <PlusIcon /> 새 컨텐츠 만들기
          </Button>
        </div>
      </header>
      <main className="space-y-10">
        <section className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card className="w-full" key={`status-${index}`}>
              <CardHeader>
                <span>
                  <CardSimIcon />
                </span>
                <span>Total</span>
              </CardHeader>
              <CardContent>
                <p>총 컨텐츠</p>
              </CardContent>
              <CardFooter>
                <p>1</p>
              </CardFooter>
            </Card>
          ))}
        </section>
        <section>
          <h3>빠른 실행</h3>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card className="w-full" key={`quickstart-${index}`}>
                <PlusIcon className="m-auto" />
                <p className="text-center">컨텐츠 생성</p>
              </Card>
            ))}
          </div>
        </section>
        <section>
          <div className="flex justify-between">
            <h3>최근 컨텐츠</h3>
            <Link to={"/contents"} className="flex items-center">
              전체보기
              <ChevronRightIcon />
            </Link>
          </div>
          <div className="flex flex-col gap-7">
            {Array.from({ length: 5 }).map((_, index) => (
              <Link to={"/contents/:id"} key={"contents" + index}>
                <Card>
                  <div className="flex justify-between px-4">
                    <div className="flex">
                      <div className="flex items-center">
                        <Avatar className="rounded-lg">
                          <AvatarImage
                            src="https://github.com/steve-jobs.png"
                            alt="@evilrabbit"
                          />
                          <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>제목</p>
                          <span>상품명</span>
                          <div className="flex">
                            <ClockIcon />
                            <span>2026.1.1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div>
                        <p>셍성된 포스팅</p>
                        <p>1개</p>
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.data.message} / {error.data.error_code}
      </div>
    );
  }
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }
  return <div>Unknown Error</div>;
}
