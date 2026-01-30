import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export default function Navigation({
  children,
  isLoggedIn,
  name,
  username,
  avatar,
  email,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}) {
  return isLoggedIn ? (
    <nav>
      <SidebarProvider className="w-fit">
        <AppSidebar
          name={name}
          username={username}
          avatar={avatar}
          email={email}
        />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </nav>
  ) : null;
}
