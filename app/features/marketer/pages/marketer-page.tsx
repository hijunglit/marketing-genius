import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/marketer-page";
import { getMarketer } from "../queries";
import { Form, redirect } from "react-router";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";
import { Button } from "~/common/components/ui/button";
import { getLoggedInUser, getUserById } from "~/features/users/queries";
import { useState } from "react";
import z from "zod";
import { updateMarketer } from "../mutations";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Marketer" }];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const user = await getUserById(client, { id: userId });
  const marketer = await getMarketer(client, { id: user.profile_id });
  return { marketer, user };
};

const formSchema = z.object({
  brandName: z.string(),
  category: z.string(),
  description: z.string(),
  coreService: z.string(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }
  const { brandName, category, description, coreService } = data;
  await updateMarketer(client, {
    id: userId,
    brandName,
    category,
    description,
    coreService,
  });
  return {
    ok: true,
  };
};

export default function MarketerPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const marketer = loaderData.marketer[0];

  return (
    <div className="p-10 space-y-10">
      <header>
        <h1 className="text-xl lg:text-2xl font-extrabold">마케터 정보</h1>
      </header>
      {actionData?.ok ? (
        <Alert>
          <AlertTitle>성공</AlertTitle>
          <AlertDescription>마케터 정보를 수정했습니다.</AlertDescription>
        </Alert>
      ) : null}
      <Form method="post" className="space-y-10">
        <div>
          <Label htmlFor="brandName" className="text-lg font-bold">
            기업명
          </Label>
          <Input name="brandName" defaultValue={marketer.company_name} />
          {actionData?.formErrors?.brandName ? (
            <Alert>
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>
                {actionData.formErrors.brandName.join(", ")}
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
        <div>
          <Label htmlFor="category" className="text-lg font-bold">
            업종
          </Label>
          <Input name="category" defaultValue={marketer.category} />
          {actionData?.formErrors?.category ? (
            <Alert>
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>
                {actionData.formErrors.category.join(", ")}
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
        <div>
          <Label htmlFor="description" className="text-lg font-bold">
            기업 상세 정보
          </Label>
          <Textarea
            name="description"
            defaultValue={marketer.company_description}
          />
          {actionData?.formErrors?.description ? (
            <Alert>
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>
                {actionData.formErrors.description.join(", ")}
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
        <div>
          <Label htmlFor="coreService" className="text-lg font-bold">
            주력 상품/서비스
          </Label>
          <Input name="coreService" defaultValue={marketer.core_service} />
          {actionData?.formErrors?.coreService ? (
            <Alert>
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>
                {actionData.formErrors.coreService.join(", ")}
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
        <Button className="cursor-pointer">수정하기</Button>
      </Form>
    </div>
  );
}
