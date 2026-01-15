import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
}
