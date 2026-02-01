import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import type { Route } from "./+types/create-marketer-page";
import { Form, Link, redirect, useNavigation } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Building2, LoaderCircle } from "lucide-react";
import { Textarea } from "~/common/components/ui/textarea";
import z from "zod";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/users/queries";
import { CreateMarketer } from "../mutations";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create Marketer" }];
}

const formSchema = z.object({
  companyName: z.string().min(1),
  category: z.string().min(1),
  coreService: z.string().min(1),
  aboutCompany: z.string().min(1),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }

  const marketerId = await CreateMarketer(client, {
    companyName: data.companyName,
    category: data.category,
    coreService: data.coreService,
    aboutCompany: data.aboutCompany,
    userId,
  });
  return redirect(`/marketer/${marketerId}`);
};

export default function CreateMarketerPage({
  actionData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "loading" || navigation.state === "submitting";
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
            <div className="bg-gray-100 p-6 rounded-2xl space-y-4 border-2 border-gray-200">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-gray-200 p-2">
                  <Building2 size={28} />
                </div>
                <h2 className="font-bold text-xl">기본 정보</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-4">
                  <Label htmlFor="companyName">기업명</Label>
                  <Input
                    name="companyName"
                    id="companyName"
                    type="text"
                    placeholder="예: 스타벅스"
                    className="border-gray-300 border-2 p-6"
                    required
                  />
                  {actionData &&
                    "formErrors" in actionData &&
                    actionData?.formErrors?.companyName && (
                      <p className="text-red-500">
                        {actionData.formErrors.companyName}
                      </p>
                    )}
                </div>
                <div className="space-y-4">
                  <Label htmlFor="category">업종</Label>
                  <Input
                    name="category"
                    id="category"
                    type="text"
                    placeholder="예: 커피전문점"
                    className="border-gray-300 border-2 p-6"
                    required
                  />
                  {actionData &&
                    "formErrors" in actionData &&
                    actionData?.formErrors?.category && (
                      <p className="text-red-500">
                        {actionData.formErrors.category}
                      </p>
                    )}
                </div>
                <div className="space-y-4">
                  <Label htmlFor="coreService">주력 상품/서비스</Label>
                  <Input
                    name="coreService"
                    id="coreService"
                    type="text"
                    placeholder="예: 시그니처 커피, 특색 음료"
                    className="border-gray-300 border-2 p-6"
                    required
                  />
                  {actionData &&
                    "formErrors" in actionData &&
                    actionData?.formErrors?.coreService && (
                      <p className="text-red-500">
                        {actionData.formErrors.coreService}
                      </p>
                    )}
                </div>
                <div className="space-y-4">
                  <Label htmlFor="aboutCompany">기업 정보 설명</Label>
                  <Textarea
                    id="aboutCompany"
                    name="aboutCompany"
                    placeholder="기업의 특징, 비즈니스 모델, 특별한 배경 등을 설명해주세요."
                    rows={10}
                    required
                  />
                  {actionData &&
                    "formErrors" in actionData &&
                    actionData?.formErrors?.aboutCompany && (
                      <p className="text-red-500">
                        {actionData.formErrors.aboutCompany}
                      </p>
                    )}
                </div>
                <small>
                  자세한 정보를 입력할수록 더 정확한 마케터가 생성됩니다.
                </small>
              </div>
            </div>
            <div className="w-full grid grid-cols-4 gap-2.5">
              <Button className="col-span-1 bg-white text-black font-bold text-lg border-gray-100 border-2 rounded-xl py-6">
                <Link to={"/dashboard"}>취소</Link>
              </Button>
              <Button
                type="submit"
                className="col-span-3 bg-white text-black font-bold text-lg border-gray-100 border-2 rounded-xl py-6"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "마케터 생성 시작"
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
