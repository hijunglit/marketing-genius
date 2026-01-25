import { PlusIcon, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Card } from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import type { Route } from "./+types/contents-page";
import { getContents } from "../queries";
import { DateTime } from "luxon";

export const meta: Route.MetaFunction = () => {
  return [{ title: "컨텐츠 | Marketing Genius" }];
};

export const loader = async () => {
  const contents = await getContents();
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
        <div>
          <Button variant={"outline"}>
            <PlusIcon /> 새 컨텐츠 만들기
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
          <div className="flex flex-col gap-7">
            {loaderData.map((contents, index) => (
              <Link to={"/contents/:id"} key={"contents" + index}>
                <Card>
                  <div className="flex flex-col justify-between px-4 sm:flex-row">
                    <div className="flex flex-col items-center sm:flex-row gap-4">
                      <div className="w-full h-24 sm:size-24 rounded-xl shadow-lg overflow-hidden flex flex-col justify-center">
                        <img src={contents.images[0].image_url} />
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="space-y-2">
                          <p className="text-lg font-bold">제목</p>
                          <div className="text-sm text-gray-700">
                            <span>상품명</span>
                            <span>|</span>
                            <span>{contents.text}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {DateTime.fromISO(contents.created_at).toRelative()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <SquarePen size={16} />
                      <Trash2 size={16} />
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
