import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export default function Navigation({
  children,
  isLoggedIn,
  name,
  username,
  avatar,
  email,
  marketerId,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
  marketerId: number | null;
}) {
  return isLoggedIn ? (
    <nav className="absolute md:relative">
      <SidebarProvider className="w-fit">
        <AppSidebar
          name={name}
          username={username}
          avatar={avatar}
          email={email}
          marketerId={marketerId}
        />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </nav>
  ) : null;
}
