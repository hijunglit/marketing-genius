import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("common/home.tsx"),
  route("/dashboard", "features/users/pages/dashboard-page.tsx"),
  ...prefix("/contents", [
    index("features/contents/pages/contents-page.tsx"),
    route("/:id", "features/contents/pages/contents-detail-page.tsx"),
  ]),
  ...prefix("/marketer", [
    index("features/marketer/pages/marketer-list-page.tsx"),
    route("/create", "features/marketer/pages/create-marketer-page.tsx"),
  ]),
  ...prefix("/posting", [
    route("/create", "features/posting/pages/create-posting-page.tsx"),
  ]),
  ...prefix("/auth", [
    layout("features/auth/layouts/auth-layout.tsx", [
      route("/login", "features/auth/pages/login-page.tsx"),
      route("/join", "features/auth/pages/join-page.tsx"),
    ]),
  ]),
] satisfies RouteConfig;

// 추상화
// abstract this component to /app/features/community/components/post-card.tsx use props for content

//파일 생성
// create these files, do not attempt to prefill any loader or action functions
