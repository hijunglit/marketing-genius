import type { Route } from "./+types/marketer-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Marketer" }];
}

export default function MarketerPage({}: Route.ComponentProps) {
  return (
    <div>
      <h1>Marketer Page</h1>
    </div>
  );
}
