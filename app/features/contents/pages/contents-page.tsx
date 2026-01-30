import { Home, PlusIcon, SquarePen, Trash2 } from "lucide-react";
import { Link, redirect } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import type { Route } from "./+types/contents-page";
import { getContents } from "../queries";
import { DateTime } from "luxon";
import { Separator } from "~/common/components/ui/separator";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "컨텐츠 | Marketing Genius" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const { data: { user }, } = await client.auth.getUser();
  if (!user) {
    return redirect("/auth/login")
  }
  const contents = await getContents(client, {id: user?.id});
  return contents;
};

export default function ContentsPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-20 space-y-10">
      <header className="flex flex-col text-center gap-2 justify-between items-center sm:flex-row sm:text-left">
        <div>
          <h1 className="text-2xl font-bold">내 컨텐츠</h1>
          <p>생성된 컨텐츠를 한 눈에 확인하고 관리세요.</p>
        </div>
        <div className="space-x-2.5">
          <Button asChild>
            <Link to={"/dashboard"}>
              <Home />
              대시보드
            </Link>
          </Button>
          <Button asChild>
            <Link to={"/posting/create"}>
              <PlusIcon /> 새 컨텐츠 만들기
            </Link>
          </Button>
        </div>
      </header>
      <main className="space-y-10">
        <section>
          <div>
            <form action="post">
              <Input
                name="search"
                id="search"
                type="text"
                placeholder="제목, 상품명으로 검색"
              />
            </form>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-2 gap-2.5">
            {loaderData.map((contents, index) => (
              <Card className="col-span-1" key={"contents" + index}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xl font-bold">
                        {contents.request_contents[0].title}
                      </p>
                      <Button className="text-xs">
                        {contents.request_contents[0].platform}
                      </Button>
                    </div>
                    <div className="flex gap-1.5">
                      <Link to={"/contents/:id"} key={"contents" + index}>
                        <SquarePen size={16} />
                      </Link>
                      <Trash2 size={16} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <p>{contents.text}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div>
                    <p>{contents.images.length} MEDIA</p>
                    <p>{contents.hashtag.length} TAGS</p>
                  </div>
                  <Separator />
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
