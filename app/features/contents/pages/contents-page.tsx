import {
  Copy,
  Download,
  Home,
  PlusIcon,
  SquarePen,
  Trash2,
} from "lucide-react";
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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/common/components/ui/carousel";
import { useState } from "react";

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
  const handleCopy = async (
    title: string,
    description: string,
    hashtag: string,
  ) => {
    try {
      navigator.clipboard.writeText(title + description + hashtag);
      alert("복사 성공!");
    } catch (err) {
      alert("복사가 실패했습니다");
    }
  };
  const handleDownload = (imagesUrl: string[], fileName?: string) => {
    try {
      alert(imagesUrl.length + "개의 이미지를 저장합니다.");
      imagesUrl.forEach(async (img, idx) => {
        const res = await fetch(img);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName ? fileName : "bok-ai-image_" + idx;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
      return;
    } catch (err) {
      console.error("다운로드 실패", err);
    }
  };
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
                  {contents.request_contents[0].platform === "instagram" && (
                    <DialogContent
                      aria-describedby={undefined}
                      className="max-w-[1024px] w-full max-h-[650px] h-full grid sm:grid-cols-2 overflow-y-auto"
                    >
                      <div className="w-full bg-black flex flex-col justify-center">
                        <Carousel className="w-full max-w-[480px] h-full max-h-[480px]">
                          <div className="p-1 h-full">
                            <CarouselContent>
                              {contents.images.map((image, index) => (
                                <CarouselItem key={image.image_url + index}>
                                  <img
                                    src={image.image_url}
                                    className="object-cover"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </div>
                        </Carousel>
                      </div>
                      <div className="flex flex-col justify-between space-y-6.5">
                        <DialogHeader>
                          <DialogTitle>
                            {contents.request_contents[0].title}
                          </DialogTitle>
                        </DialogHeader>
                        <div>{contents.text}</div>
                        <div className="text-[#2563EB]">
                          {contents.hashtag.split(" ").join(" ")}
                        </div>
                        <DialogFooter className="space-x-1.5">
                          <div className="space-x-1.5">
                            <Button
                              onClick={() =>
                                handleCopy(
                                  contents.request_contents[0].title,
                                  contents.text,
                                  contents.hashtag,
                                )
                              }
                              variant={"secondary"}
                              className="cursor-pointer"
                            >
                              <Copy />
                              복사
                            </Button>
                            <Button
                              onClick={() =>
                                handleDownload(
                                  contents.images.map((i) => i.image_url),
                                )
                              }
                              variant={"secondary"}
                              className="cursor-pointer"
                            >
                              <Download />
                              이미지
                            </Button>
                          </div>

                          <DialogClose asChild className="cursor-pointer">
                            <Button variant={"outline"}>닫기</Button>
                          </DialogClose>
                        </DialogFooter>
                      </div>
                    </DialogContent>
                  )}

                  {contents.request_contents[0].platform === "blog" && (
                    <DialogContent className="max-w-[1024px] w-full max-h-[650px] h-full">
                      <DialogHeader>
                        <h1 className="text-[#15803D] font-bold text-lg">
                          블로그
                        </h1>
                      </DialogHeader>
                      <Separator className="bg-[#15803D]" />
                      <div className="no-scrollbar h-full overflow-y-auto px-4">
                        <div>
                          <h1 className="text-3xl font-bold">
                            {contents.request_contents[0].title}
                          </h1>
                          <span className="text-gray-400 text-sm">
                            이미지 {contents.images.length} 개
                          </span>
                        </div>
                        <Separator />
                        {contents.images.map((img, index) => (
                          <div
                            key={"preview:" + img.image_url + index}
                            className="max-w-3xl w-full"
                          >
                            <img src={img.image_url} className="object-cover" />
                          </div>
                        ))}
                        <p>{contents.text}</p>
                      </div>
                      <DialogClose asChild className="cursor-pointer">
                        <Button variant={"outline"}>닫기</Button>
                      </DialogClose>
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
                          <Link to={"#"} key={"contents" + index}>
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
