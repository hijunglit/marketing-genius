import {
  CardSimIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";
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
import { Input } from "~/common/components/ui/input";

export const loader = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return null;
};

export default function ContentsPage() {
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
            {Array.from({ length: 5 }).map((_, index) => (
              <Link to={"/contents/:id"} key={"contents" + index}>
                <Card>
                  <div className="flex flex-col justify-between px-4 sm:flex-row">
                    <div className="flex flex-col items-center sm:flex-row gap-4">
                      <div className="w-full h-24 sm:size-24 rounded-xl shadow-lg overflow-hidden flex flex-col justify-center">
                        <img src="https://i.pinimg.com/736x/ec/5f/b6/ec5fb6c189249e061bcce0159cac38ec.jpg" />
                        {/* <img src="https://i.pinimg.com/736x/9c/3b/72/9c3b7274384a0bab197fd68115a395ff.jpg" /> */}
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="space-y-2">
                          <p className="text-lg font-bold">제목</p>
                          <div className="text-sm text-gray-700">
                            <span>상품명</span>
                            <span>|</span>
                            <span>설명</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">2026.1.1</span>
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
