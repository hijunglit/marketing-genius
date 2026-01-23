import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import type { Route } from "./+types/create-marketer-page";
import { Form, Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Building2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create Marketer" }];
}

export default function CreateMarketerPage({}: Route.ComponentProps) {
  return (
    <div className="p-20 space-y-10">
      <Card className="w-full max-w-4xl space-y-2">
        <CardHeader className="text-center w-xs m-auto">
          <CardTitle className="text-3xl font-bold">마케터 생성</CardTitle>
          <CardDescription>
            맞춤형 마케터를 생성하기 위해 비즈니스 및 상품 정보를 자세히 입력해
            주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-5">
            <div className="bg-blue-100 p-6 rounded-2xl space-y-4 border-2 border-blue-200">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-blue-200 p-2">
                  <Building2 size={28} />
                </div>
                <h2 className="font-bold text-xl">기본 정보</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-4">
                  <Label htmlFor="category">업종</Label>
                  <Input
                    name="category"
                    id="category"
                    type="text"
                    placeholder="예: 커피전문점"
                    className="border-blue-200 border-2 p-6"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="mainItem">주력 상품/서비스</Label>
                  <Input
                    name="mainItem"
                    id="mainItem"
                    type="text"
                    placeholder="예: 시그니처 커피, 특색 음료"
                    className="border-blue-200 border-2 p-6"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="company">기업 정보 설명</Label>
                  <Input
                    name="company"
                    id="company"
                    type="text"
                    placeholder="기업의 특징, 비즈니스 모델, 배경등을 설명해주세요"
                    className="border-blue-200 border-2 p-6"
                    required
                  />
                </div>
                <small>
                  자세한 정보를 입력할수록 더 정확한 마케터가 생성됩니다.
                </small>
              </div>
            </div>
            <div className="w-full grid grid-cols-4 gap-2.5">
              <Button
                variant="destructive"
                className="col-span-1 bg-white text-black font-bold text-lg border-gray-100 border-2 rounded-xl py-6"
              >
                <Link to={"/dashboard"}>취소</Link>
              </Button>
              <Button
                variant="destructive"
                type="submit"
                className="col-span-3 bg-white text-black font-bold text-lg border-gray-100 border-2 rounded-xl py-6"
              >
                마케터 생성 시작
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
