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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";

export const meta: Route.MetaFunction = () => {
  return [{ title: "컨텐츠 | Marketing Genius" }];
};

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

export default function ContentsPage({ loaderData }: Route.ComponentProps) {
  const contents = loaderData;
  return (
    <div className="p-4 lg:p-20 space-y-10">
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
          {contents.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-5">
              {loaderData.map((contents, index) => (
                <Dialog key={"model" + index}>
                  {contents.request_contents[0].platform === "instagram" ? (
                    <DialogContent>
                      {contents.request_contents[0].platform}
                    </DialogContent>
                  ) : (
                    <DialogContent>
                      {contents.request_contents[0].platform}
                    </DialogContent>
                  )}
                  <Card
                    className="flex flex-col justify-between w-full h-[255px]"
                    key={"contents" + index}
                  >
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-base font-bold">
                            {contents.request_contents[0].title}
                          </p>
                          <DialogTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`text-xs p-1.5 rounded-md cursor-pointer ${contents.request_contents[0].platform === "instagram" ? "bg-[#fdf2f8] text-[#be185d]" : "bg-[#f0fdf4] text-[#15803D]"}`}
                            >
                              {contents.request_contents[0].platform}
                            </Button>
                          </DialogTrigger>
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
                      <div className="bg-gray-100 p-3 rounded-2xl h-[56px] overflow-hidden text-ellipsis">
                        <p className="text-xs">{contents.text}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                      <div className=" w-full text-xs flex justify-start gap-2">
                        <span>{contents.images.length} MEDIA</span>
                        <span>{contents.hashtag.split(" ").length} TAGS</span>
                      </div>
                      <Separator />
                    </CardFooter>
                  </Card>
                </Dialog>
              ))}
            </div>
          ) : (
            <h1 className="text-center">생성한 포스팅이 없습니다.</h1>
          )}
        </section>
      </main>
    </div>
  );
}
