import {
  Archive,
  Bot,
  Calendar,
  CardSimIcon,
  ChevronRightIcon,
  ClockIcon,
  File,
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

const top_items = [
  {
    icon: File,
    enTitle: "Total",
    koTitle: "총 컨텐츠",
    amount: 1,
  },
  {
    icon: Bot,
    enTitle: "AI",
    koTitle: "마케터",
    amount: 1,
  },
  {
    icon: Calendar,
    enTitle: "Weekly",
    koTitle: "이번 주 활동",
    amount: 1,
  },
];

const quick_run_items = [
  {
    icon: PlusIcon,
    title: "컨텐츠 생성",
  },
  {
    icon: Archive,
    title: "컨텐츠 관리",
  },
  {
    icon: Bot,
    title: "AI 생성",
  },
  {
    icon: Bot,
    title: "AI 관리",
  },
];

export const loader = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return;
};

export default function Dashboard() {
  return (
    <div className="p-20 space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p>오늘의 마케팅 현황을 한눈에 확인하세요.</p>
        </div>
        <div>
          <Button variant={"outline"}>
            <PlusIcon /> 새 컨텐츠 만들기
          </Button>
        </div>
      </header>
      <main className="space-y-10">
        <section className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
          {top_items.map((item, index) => (
            <Card className="w-full" key={`status-${index}`}>
              <CardHeader className="w-full flex justify-between">
                <item.icon />
                <p className="text-xs">{item.enTitle}</p>
              </CardHeader>
              <CardContent>
                <p>{item.koTitle}</p>
              </CardContent>
              <CardFooter className="font-bold text-3xl">
                <p>{item.amount}</p>
              </CardFooter>
            </Card>
          ))}
        </section>
        <section>
          <h3 className="text-lg font-bold">빠른 실행</h3>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
            {quick_run_items.map((item, index) => (
              <Card className="w-full" key={`quickstart-${index}`}>
                <Link to={"#"}>
                  <item.icon className="m-auto" />
                  <p className="text-center">{item.title}</p>
                </Link>
              </Card>
            ))}
          </div>
        </section>
        <section>
          <div className="flex justify-between">
            <h3 className="text-lg font-bold">최근 컨텐츠</h3>
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
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl shadow-lg overflow-hidden">
                          <img src="https://i.pinimg.com/736x/9c/3b/72/9c3b7274384a0bab197fd68115a395ff.jpg" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">제목</p>
                          <span className="text-xs">상품명</span>
                          <div className="flex items-center text-xs">
                            <ClockIcon size={10} />
                            <span>2026.1.1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">생성된 포스팅</p>
                        <p className="font-bold">1개</p>
                      </div>
                      <ChevronRightIcon color="#ccc" />
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
