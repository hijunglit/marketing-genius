import {
  Archive,
  Bot,
  Calendar,
  CardSimIcon,
  ChevronRightIcon,
  Clock,
  ClockIcon,
  File,
  NotebookText,
  PlusIcon,
} from "lucide-react";
import { isRouteErrorResponse, Link, redirect } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/common/components/ui/card";
import type { Route } from "./+types/dashboard-page";
import { getContents } from "~/features/contents/queries";
import { makeSSRClient } from "~/supa-client";
import { DateTime } from "luxon";
import { getUserById } from "../queries";

const top_items = [
  {
    icon: File,
    enTitle: "Total",
    koTitle: "전체 포스팅",
    amount: 1,
  },
  {
    icon: Bot,
    enTitle: "Marketer",
    koTitle: "마케터",
    amount: 1,
  },
  {
    icon: Calendar,
    enTitle: "Scheduled",
    koTitle: "예약됨",
    amount: 1,
  },
  {
    icon: Clock,
    enTitle: "Published",
    koTitle: "발행 완료",
    amount: 1,
  },
];

const quick_run_items = [
  {
    icon: PlusIcon,
    title: "포스팅 생성",
    url: "/posting/create"
  },
  {
    icon: Archive,
    title: "포스팅 관리",
    url: "/contents"
  },
  {
    icon: Bot,
    title: "마케터 생성",
    url: "/marketer/create"
  },
  {
    icon: NotebookText,
    title: "마케터 관리",
    url: "/marketer"
  },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }
  const contents = await getContents(client, { id: user?.id });
  return contents;
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-20 space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p>오늘의 마케팅 현황을 한눈에 확인하세요.</p>
        </div>
        <div>
          <Button asChild>
            <Link to={"/posting/create"}>
              <PlusIcon /> 새 포스팅
              </Link>
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
                <Link to={item.url}>
                  <item.icon className="m-auto" />
                  <p className="text-center">{item.title}</p>
                </Link>
              </Card>
            ))}
          </div>
        </section>
        <section>
          <div className="flex justify-between">
            <h3 className="text-lg font-bold">최근 포스팅</h3>
            <Link to={"/contents"} className="flex items-center">
              전체보기
              <ChevronRightIcon />
            </Link>
          </div>
          <div className="flex flex-col gap-7">
            {loaderData.map((contents, index) => (
              <Link to={"/contents/:id"} key={"contents" + index}>
                <Card>
                  <div className="flex justify-between px-4">
                    <div className="flex">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl shadow-lg overflow-hidden">
                          <img src={contents.images[0].image_url} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">
                            {contents.request_contents[0].title}
                          </p>
                          <span className="text-xs">
                            {contents.request_contents[0].product_name}
                          </span>
                          <div className="flex items-center text-xs">
                            <ClockIcon size={10} />
                            <span>
                              {DateTime.fromISO(
                                contents.created_at,
                              ).toRelative()}
                            </span>
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
