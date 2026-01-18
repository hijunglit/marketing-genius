import {
  CardSimIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  Search,
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
                    <div className="sm:flex">
                      <div className="flex flex-col items-center sm:flex-row">
                        <Avatar className="rounded-4xl">
                          <AvatarImage
                            src="https://github.com/hijunglit.png"
                            alt="@evilrabbit"
                          />
                          <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-between w-full sm:flex-col gap-4">
                          <div>
                            <p>제목</p>
                            <span>상품명</span>
                            <span>|</span>
                            <span>설명</span>
                          </div>
                          <div className="flex">
                            <ClockIcon />
                            <span>2026.1.1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <p>편집</p>
                      <p>삭제</p>
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
