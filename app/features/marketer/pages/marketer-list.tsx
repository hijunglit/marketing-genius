import type { Route } from "./+types/marketer-list";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Marketers" },
  ];
}

export default function MarketerListPage({}: Route.ComponentProps) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Marketers</h1>
    </div>
  );
}
