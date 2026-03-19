import { Link, redirect } from "react-router";
import type { Route } from "./+types/home";
import { RollingBanner } from "./components/rolling-banner";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "홈 | 복덩이 AI" },
    { content: "자영업자의 홍보를 책임지는 AI 마케터" },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return;
  return user;
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const logoUrl =
    "https://github-production-user-asset-6210df.s3.amazonaws.com/113867021/562674819-a236fc1e-039f-445b-b4a4-6e53ed473d4c.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260313%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260313T021342Z&X-Amz-Expires=300&X-Amz-Signature=112392c0854ef066cb1d18b53399658dfc70b1762166c4ff417823c6034865e6&X-Amz-SignedHeaders=host";
  const logoText =
    "https://github-production-user-asset-6210df.s3.amazonaws.com/113867021/562080151-8d33a8df-2673-4c2f-96eb-8d684abe3821.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260312%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260312T073413Z&X-Amz-Expires=300&X-Amz-Signature=3b77ca4a0d0094b83a4027cb1bf9e05e93cf6512360d10145e553950d09c5fc5&X-Amz-SignedHeaders=host";
  return (
    <main style={styles.page}>
      <RollingBanner />
      <header style={styles.header}>
        <div style={styles.brand} className="flex items-center">
          {/* <img src={logoUrl} className="w-[80px] h-[80px]" /> */}
          <strong className="text-2xl">복덩이 AI</strong>
        </div>
        <nav style={styles.nav}>
          <a href="#how" style={styles.navLink}>
            사용 방법
          </a>
          <a href="#pricing" style={styles.navLink}>
            요금
          </a>
          <a href="#faq" style={styles.navLink}>
            FAQ
          </a>
        </nav>
        <div className="flex gap-1">
          {loaderData ? (
            <Link to={"/dashboard"} style={styles.headerCta}>
              시작하기
            </Link>
          ) : (
            <>
              <Link to={"/auth/login"} style={styles.headerCta}>
                로그인
              </Link>
              <Link to={"/auth/join"} style={styles.headerCta}>
                무료로 시작하기
              </Link>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.h1}>마케팅 글, 이제 10분이면 충분합니다</h1>
          <p style={styles.sub}>
            브랜드 정보 기반으로 인스타그램 게시글을 자동 생성합니다.
            <br />
            초안 + 해시태그 + 콘텐츠 구조까지 한 번에.
          </p>

          <div style={styles.ctaRow}>
            <a href="/auth/join" style={styles.primaryCta}>
              무료로 시작하기
            </a>
            <a href="#demo" style={styles.secondaryCta}>
              데모 보기
            </a>
          </div>

          <p style={styles.micro}>가입 즉시 사용 · 카드 결제 없이 시작</p>

          <div style={styles.badgeRow}>
            <span style={styles.badge}>게시글 초안</span>
            <span style={styles.badge}>해시태그 추천</span>
            <span style={styles.badge}>브랜드 톤 유지</span>
          </div>
        </div>

        <div style={styles.heroRight} id="demo" aria-label="product demo">
          <div style={styles.mock}>
            <div style={styles.mockTop}>Preview</div>
            <div style={styles.mockBody}>
              <div style={styles.mockLine} />
              <div style={styles.mockLine} />
              <div style={{ ...styles.mockLine, width: "70%" }} />
              <div style={styles.mockPillRow}>
                <span style={styles.mockPill}>#브랜드</span>
                <span style={styles.mockPill}>#프로모션</span>
                <span style={styles.mockPill}>#인스타</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM -> SOLUTION */}
      <section style={styles.section}>
        <div style={styles.grid3}>
          <Feature
            title="막막함 → 구조를 제공합니다"
            desc="“무슨 말을 어떤 순서로 쓸지”부터 잡아줍니다."
          />
          <Feature
            title="시간 부족 → 반복이 빠릅니다"
            desc="마음에 안 들면 다시 생성하면 됩니다. 수정도 쉽게."
          />
          <Feature
            title="일관성 부족 → 브랜드 톤을 유지합니다"
            desc="처음 입력한 브랜드 정보가 모든 콘텐츠의 기준이 됩니다."
          />
        </div>
      </section>

      {/* HOW */}
      <section style={styles.section} id="how">
        <h2 style={styles.h2}>사용 방법</h2>
        <div style={styles.steps}>
          <Step
            n="1"
            title="브랜드/업종 입력"
            desc="한 번만 입력하면 이후 콘텐츠에 계속 반영됩니다."
          />
          <Step
            n="2"
            title="제품/목표 선택"
            desc="판매/브랜딩/홍보 중 목적에 맞게 생성합니다."
          />
          <Step
            n="3"
            title="생성 → 수정 → 업로드"
            desc="초안/해시태그/구성까지 한 번에 받습니다."
          />
        </div>
      </section>

      {/* EXAMPLES */}
      <section style={styles.section}>
        <h2 style={styles.h2}>결과물 예시</h2>
        <div style={styles.grid3}>
          <ExampleCard
            title="카페 신메뉴 홍보"
            body="오늘부터 출시! 한입에 기분이 바뀌는 시즌 한정 라떼 ☕️\n지금 매장에서 가장 먼저 만나보세요."
            tags={["#신메뉴", "#시즌한정", "#카페추천"]}
          />
          <ExampleCard
            title="서비스 업데이트 공지"
            body="이제 더 빠르게 생성됩니다.\n새 템플릿 5종과 톤 조절 기능을 추가했습니다."
            tags={["#업데이트", "#제품개선", "#SaaS"]}
          />
          <ExampleCard
            title="할인 프로모션"
            body="이번 주말 48시간 한정.\n놓치면 끝입니다. 지금 바로 혜택을 가져가세요."
            tags={["#할인", "#주말특가", "#한정"]}
          />
        </div>
      </section>

      {/* PRICING */}
      <section style={styles.section} id="pricing">
        <h2 style={styles.h2}>요금</h2>
        <div style={styles.pricingGrid}>
          <PriceCard
            name="Free"
            price="₩0"
            subtitle="가볍게 시작"
            items={["월 30회 생성", "기본 템플릿", "기본 해시태그 추천"]}
            ctaText="무료로 시작하기"
            ctaHref="/auth/join"
            highlighted={false}
          />
          <PriceCard
            color="#ccc"
            name="Pro"
            price="₩2,900"
            subtitle="꾸준히 성장"
            items={["월 100회 생성", "톤/템플릿 확장", "우선 생성 + 빠른 개선"]}
            ctaText="Pro로 업그레이드"
            ctaHref="#"
            highlighted={true}
          />
        </div>
        <p style={styles.micro}>
          * 현태 베타 테스트 버전으로 무료 이용이 가능합니다. <br />
          추후 유료로 변경될 수 있습니다.
        </p>
      </section>

      {/* FAQ */}
      <section style={styles.section} id="faq">
        <h2 style={styles.h2}>FAQ</h2>
        <div style={styles.faq}>
          <FAQ
            q="AI가 게시글을 자동으로 업로드해주나요?"
            a="현재는 초안을 생성해주는 방식입니다. 사용자가 검토 후 직접 업로드합니다."
          />
          <FAQ
            q="어떤 플랫폼을 지원하나요?"
            a="Instagram 등 텍스트 중심 SNS부터 우선 지원합니다. 계속 확장 예정입니다."
          />
          <FAQ
            q="브랜드 톤은 어떻게 반영되나요?"
            a="가입 시 입력한 브랜드/업종 정보와 톤 설정이 모든 생성 결과물에 반영됩니다."
          />
          <FAQ
            q="무료 플랜으로도 충분히 써볼 수 있나요?"
            a="네. 생성 흐름을 체험하기엔 Free로 충분합니다. 사용량이 늘면 Pro로 전환하면 됩니다."
          />
          <FAQ
            q="환불/해지는 어떻게 되나요?"
            a="결제/환불 정책은 런칭 단계에서 명확히 고지할 수 있도록 곧 정리해두는 것을 추천합니다."
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ ...styles.section, paddingBottom: 80 }}>
        <div style={styles.finalCtaBox}>
          <h2 style={{ ...styles.h2, margin: 0 }}>
            오늘부터, 마케팅을 가볍게 돌리세요
          </h2>
          <p style={{ ...styles.sub, marginTop: 10 }}>
            콘텐츠는 더 빠르게. 톤은 더 일관되게.
          </p>
          <div style={styles.ctaRow}>
            <Link to={"/auth/join"} style={styles.primaryCta}>
              무료로 시작하기
            </Link>
            <Link to={"#"} style={styles.secondaryCta}>
              요금 보기
            </Link>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div>© {new Date().getFullYear()} YourBrand. All rights reserved.</div>
        <div style={styles.footerLinks}>
          <a href="/terms" style={styles.navLink}>
            이용약관
          </a>
          <a href="/privacy" style={styles.navLink}>
            개인정보처리방침
          </a>
          <a href="mailto:hello@yourbrand.com" style={styles.navLink}>
            문의
          </a>
        </div>
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.h3}>{title}</h3>
      <p style={styles.p}>{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div style={styles.step}>
      <div style={styles.stepNum}>{n}</div>
      <div>
        <div style={styles.stepTitle}>{title}</div>
        <div style={styles.stepDesc}>{desc}</div>
      </div>
    </div>
  );
}

function ExampleCard({
  title,
  body,
  tags,
}: {
  title: string;
  body: string;
  tags: string[];
}) {
  return (
    <div style={styles.card}>
      <h3 style={styles.h3}>{title}</h3>
      <pre style={styles.pre}>{body}</pre>
      <div style={styles.tagRow}>
        {tags.map((t) => (
          <span key={t} style={styles.tag}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PriceCard({
  name,
  price,
  subtitle,
  items,
  ctaText,
  ctaHref,
  highlighted,
  color,
}: {
  name: string;
  price: string;
  subtitle: string;
  items: string[];
  ctaText: string;
  ctaHref: string;
  highlighted: boolean;
  color?: string;
}) {
  return (
    <div
      style={{
        ...styles.priceCard,
        ...(highlighted ? styles.priceCardHi : {}),
      }}
    >
      <div style={styles.priceTop}>
        <div style={{ ...styles.priceName, color: `${color ? color : null}` }}>
          {name}
        </div>
        <div style={{ ...styles.price, color: `${color ? color : null}` }}>
          {price}
          <span
            style={{ ...styles.priceUnit, color: `${color ? color : null}` }}
          >
            /월
          </span>
        </div>
        <div style={{ ...styles.priceSub, color: `${color ? color : null}` }}>
          {subtitle}
        </div>
      </div>
      <ul style={{ ...styles.ul, color: `${color ? color : null}` }}>
        {items.map((x) => (
          <li key={x} style={styles.li}>
            {x}
          </li>
        ))}
      </ul>
      <a
        href={ctaHref}
        style={{
          ...styles.primaryCta,
          width: "100%",
          textAlign: "center",
          color: `${color ? "#fff" : null}`,
          pointerEvents: `${color ? "none" : "auto"}`,
          border: `${color ? "1px #ccc outline" : null}`,
          background: `${color ? "#ccc" : null}`,
        }}
      >
        {ctaText}
      </a>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details style={styles.faqItem}>
      <summary style={styles.faqQ}>{q}</summary>
      <div style={styles.faqA}>{a}</div>
    </details>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Apple SD Gothic Neo, Noto Sans KR, Arial",
    color: "#0b0f19",
    background: "#ffffff",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: "1px solid #eef0f4",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
  },
  brand: { fontWeight: 800, letterSpacing: "-0.3px" },
  nav: { display: "flex", gap: 14, alignItems: "center" },
  navLink: { color: "#445065", textDecoration: "none", fontSize: 14 },
  headerCta: {
    textDecoration: "none",
    fontSize: 14,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e6e8ee",
    color: "#0b0f19",
  },

  hero: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: "56px 18px 28px",
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 22,
  },
  heroLeft: {},
  heroRight: {},
  h1: {
    fontSize: 44,
    lineHeight: 1.08,
    letterSpacing: "-1px",
    margin: "0 0 14px",
  },
  sub: { margin: "0 0 18px", fontSize: 16, lineHeight: 1.6, color: "#445065" },
  micro: { margin: "12px 0 0", fontSize: 13, color: "#66738a" },

  ctaRow: { display: "flex", gap: 10, alignItems: "center", marginTop: 8 },
  primaryCta: {
    background: "#0b0f19",
    color: "#fff",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: 12,
    fontWeight: 700,
  },
  secondaryCta: {
    background: "#f3f5f9",
    color: "#0b0f19",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: 12,
    fontWeight: 700,
  },

  badgeRow: { display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#f3f5f9",
    color: "#0b0f19",
  },

  mock: {
    border: "1px solid #e6e8ee",
    borderRadius: 16,
    overflow: "hidden",
    background: "#fff",
  },
  mockTop: {
    padding: "10px 12px",
    background: "#f7f8fb",
    borderBottom: "1px solid #eef0f4",
    fontSize: 12,
    color: "#66738a",
  },
  mockBody: { padding: 14 },
  mockLine: {
    height: 12,
    background: "#eef0f4",
    borderRadius: 8,
    marginBottom: 10,
  },
  mockPillRow: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  mockPill: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#0b0f19",
    color: "#fff",
  },
  mockCaption: { marginTop: 10, fontSize: 12, color: "#66738a" },

  section: { maxWidth: 1080, margin: "0 auto", padding: "36px 18px" },
  h2: { fontSize: 28, letterSpacing: "-0.6px", margin: "0 0 18px" },
  h3: { fontSize: 16, margin: "0 0 10px", letterSpacing: "-0.2px" },
  p: { margin: 0, color: "#445065", lineHeight: 1.65, fontSize: 14 },

  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  card: {
    border: "1px solid #e6e8ee",
    borderRadius: 16,
    padding: 16,
    background: "#fff",
  },

  steps: { display: "grid", gap: 12 },
  step: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    border: "1px solid #e6e8ee",
    borderRadius: 16,
    padding: 14,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 10,
    background: "#0b0f19",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },
  stepTitle: { fontWeight: 800, marginBottom: 4 },
  stepDesc: { color: "#445065", fontSize: 14, lineHeight: 1.6 },

  pre: {
    margin: "0 0 12px",
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    color: "#0b0f19",
    lineHeight: 1.6,
  },
  tagRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  tag: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#f3f5f9",
    color: "#0b0f19",
  },

  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
    alignItems: "stretch",
  },
  priceCard: {
    border: "1px solid #e6e8ee",
    borderRadius: 16,
    padding: 18,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  priceCardHi: { border: "2px solid #0b0f19" },
  priceTop: {},
  priceName: { fontWeight: 900, marginBottom: 6 },
  price: { fontSize: 32, fontWeight: 900, letterSpacing: "-0.8px" },
  priceUnit: { fontSize: 13, color: "#66738a", fontWeight: 700, marginLeft: 6 },
  priceSub: { color: "#445065", marginTop: 6 },
  ul: { margin: 0, paddingLeft: 18, color: "#445065", lineHeight: 1.8 },
  li: { marginBottom: 4, fontSize: 14 },

  faq: { display: "grid", gap: 10 },
  faqItem: {
    border: "1px solid #e6e8ee",
    borderRadius: 16,
    padding: 12,
    background: "#fff",
  },
  faqQ: { cursor: "pointer", fontWeight: 800, listStyle: "none" },
  faqA: { marginTop: 10, color: "#445065", lineHeight: 1.65, fontSize: 14 },

  finalCtaBox: {
    border: "1px solid #e6e8ee",
    borderRadius: 20,
    padding: 18,
    background: "#f7f8fb",
  },

  footer: {
    borderTop: "1px solid #eef0f4",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    color: "#66738a",
    fontSize: 13,
  },
  footerLinks: { display: "flex", gap: 12, alignItems: "center" },
};
