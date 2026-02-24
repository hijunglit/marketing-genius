import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/marketer-page";
import { getMarketer } from "../queries";
import { Form, redirect } from "react-router";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";
import { Button } from "~/common/components/ui/button";
import { getLoggedInUser } from "~/features/users/queries";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Marketer" }];
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const formData = await request.formData();
  try {
    console.log(formData);
  } catch (err) {
    throw err;
  }
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }
  const marketer = await getMarketer(client, { id: user?.id });
  return marketer;
};

export default function MarketerPage({ loaderData }: Route.ComponentProps) {
  const marketer = loaderData[0];

  return (
    <div className="p-20 space-y-10">
      <header>
        <h1 className="text-xl lg:text-2xl font-extrabold">마케터 정보</h1>
      </header>
      <Form method="post" className="space-y-10">
        <div>
          <Label htmlFor="brandName" className="text-lg font-bold">
            기업명
          </Label>
          <Input name="brandName" value={marketer.company_name} />
        </div>
        <div>
          <Label htmlFor="category" className="text-lg font-bold">
            업종
          </Label>
          <Input name="category" value={marketer.category} />
        </div>
        <div>
          <Label htmlFor="description" className="text-lg font-bold">
            기업 상세 정보
          </Label>
          <Textarea name="description" value={marketer.company_description} />
        </div>
        <div>
          <Label htmlFor="coreService" className="text-lg font-bold">
            주력 상품/서비스
          </Label>
          <Input name="coreService" value={marketer.core_service} />
        </div>
        <Button disabled={true}>수정하기</Button>
      </Form>
    </div>
  );
}
