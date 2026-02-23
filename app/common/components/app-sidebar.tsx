import {
  Bot,
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  House,
  LayoutDashboard,
  Plus,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

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
    icon: Plus,
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to={"/"}>
                <Home />
                <span>Marketing Genius</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Separator />
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
