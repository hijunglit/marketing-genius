import {
  Bot,
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
  User2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Menu items.
const items = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "포스팅 요청",
    url: "/posting/create",
    icon: Home,
  },
  {
    title: "마케터 관리",
    url: "/marketer",
    icon: Calendar,
  },
  {
    title: "포스팅 목록",
    url: "/contents",
    icon: Search,
  },
  {
    title: "마케터 생성",
    url: "/marketer/create",
    icon: Bot,
  },
  // {
  //   title: "설정",
  //   url: "#",
  //   icon: Settings,
  // },
];

export function AppSidebar({
  name,
  username,
  avatar,
  email,
}: {
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link to={"/"} className="font-bold">
              Marrketing Genius
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-fit flex">
                  <Avatar>
                    {avatar ? (
                      <AvatarImage src={avatar} alt="Avatar" />
                    ) : (
                      <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-bold text-[13px]">{name}</p>
                    <p className="font-light text-[11px]">{email}</p>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>계정</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>결제</span>
                </DropdownMenuItem>
                <Link to={"/auth/logout"}>
                  <DropdownMenuItem>로그아웃</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
