import { Link } from "react-router";

export default function landingPage() {
  const problems = [
    {
      title: "뭘 올려야 할지 모르겠어요",
      description:
        "매일 홍보 글을 생각하는 것만으로도 부담됩니다. 장사도 바쁜데 글까지 직접 쓰려면 더 지칩니다.",
    },
    {
      title: "글 쓰는 데 시간이 너무 걸려요",
      description:
        "SNS 홍보 문구, 소개 글, 해시태그까지 하나하나 직접 만들려면 생각보다 시간이 많이 듭니다.",
    },
    {
      title: "열심히 올려도 반응이 없어요",
      description:
        "내 가게에 맞는 말과 표현이 아니면 손님에게 잘 닿지 않습니다. 반복할수록 더 막막해집니다.",
    },
  ];

  const features = [
    {
      title: "SNS 홍보 글 생성",
      description:
        "인스타그램, 블로그, 홍보 게시글에 바로 쓸 수 있는 문구를 빠르게 만들어드립니다.",
    },
    {
      title: "해시태그 추천",
      description:
        "업종, 지역, 분위기에 맞는 해시태그를 추천해 손님에게 더 잘 닿도록 도와드립니다.",
    },
    {
      title: "가게 맞춤 문체 제안",
      description:
        "친근한 톤, 신뢰감 있는 톤, 이벤트용 문구 등 상황에 맞게 스타일을 바꿔 쓸 수 있습니다.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "가게 정보를 입력하세요",
      description:
        "가게 이름, 업종, 메뉴 또는 서비스 특징을 간단히 입력합니다.",
    },
    {
      step: "02",
      title: "원하는 홍보 스타일을 고르세요",
      description:
        "친근하게, 깔끔하게, 이벤트 느낌으로 등 원하는 분위기를 선택합니다.",
    },
    {
      step: "03",
      title: "바로 사용할 홍보 글을 받아보세요",
      description:
        "SNS 글, 소개 문구, 해시태그를 바로 복사해서 사용할 수 있습니다.",
    },
  ];

  const examples = [
    {
      business: "네일샵",
      mood: "따뜻하고 친근한 느낌",
      goal: "신규 고객 방문 유도",
      output:
        "손끝까지 기분 좋아지는 시간 ✨ 편안한 분위기에서 꼼꼼하게 관리받고 싶으셨다면 이번 주 방문해보세요. 첫 방문 고객님을 위한 혜택도 준비되어 있습니다.",
      hashtags: "#네일샵 #신규고객이벤트 #봄네일 #분위기좋은샵",
    },
    {
      business: "카페",
      mood: "감성적이고 깔끔한 느낌",
      goal: "신메뉴 홍보",
      output:
        "오늘 하루를 조금 더 특별하게 만들어줄 신메뉴가 나왔습니다. 은은한 향과 부드러운 맛으로, 바쁜 일상 속 작은 여유를 전해드릴게요.",
      hashtags: "#카페신메뉴 #감성카페 #디저트카페 #동네카페",
    },
  ];
  const logoUrl =
    "https://cdn.midjourney.com/ada80b5f-bb47-49f8-9a97-fcc740eb2d33/0_0.png";
  const mascot =
    "https://github-production-user-asset-6210df.s3.amazonaws.com/113867021/562067750-936383e1-e69d-49ce-b157-867d99429265.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260312%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260312T070527Z&X-Amz-Expires=300&X-Amz-Signature=9c681a9f801132fd694a3790ff9e771c6a83ee321d5584535983e352b63807a4&X-Amz-SignedHeaders=host";
  return (
    <main className="bg-[#FFF8F1] text-[#2B2118]">
      <header style={styles.header}>
        <div
          style={styles.brand}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <img src={logoUrl} className="w-[50px] h-[50px] rounded-lg" />
          복덩이 AI
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
          <Link to={"/auth/login"} style={styles.headerCta}>
            로그인
          </Link>
          <Link to={"/auth/join"} style={styles.headerCta}>
            무료로 시작하기
          </Link>
        </div>
      </header>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#F1E3D3]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 md:px-10 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full bg-[#FFE7D1] px-4 py-2 text-sm font-medium text-[#9A4E1A]">
              복주머니 도깨비가 도와주는 사장님 마케팅
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              사장님 가게에 손님을 데려오는
              <span className="block text-[#D94841]">복덩이 AI</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5A4A3D]">
              가게 소개만 입력하면 복덩이 AI가 SNS 홍보 글, 문구, 해시태그를
              빠르게 만들어드립니다. 어려운 마케팅 말고, 사장님이 바로 쓸 수
              있는 결과에 집중했습니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-[#D94841] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:opacity-95">
                무료로 시작하기
              </button>
              <button className="rounded-2xl border border-[#D7C2AE] bg-white px-6 py-4 text-base font-semibold text-[#5A4A3D] transition hover:bg-[#FFF4E8]">
                예시 보기
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#6E5A4A]">
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                어렵게 홍보하지 마세요
              </span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                바로 복사해서 사용 가능
              </span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">
                가게에 맞는 문구 추천
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto max-w-md rounded-[32px] border border-[#F1D3B5] bg-white p-8 shadow-[0_20px_70px_rgba(120,70,20,0.10)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#9A4E1A]">마스코트</p>
                  <h2 className="text-2xl font-bold">복이</h2>
                </div>
                <span className="rounded-full bg-[#FFF1D6] px-3 py-1 text-sm font-semibold text-[#AA6A00]">
                  복주머니 도깨비
                </span>
              </div>

              <div className="flex min-h-[280px] items-center justify-center rounded-[24px] bg-[#FFF7EC] p-8">
                <div className="relative flex flex-col items-center">
                  {/* simple mascot placeholder */}
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[#FFD8B5]">
                    <img src={mascot} />
                  </div>

                  <div className="mt-4 rounded-[20px] bg-[#D94841] px-5 py-4 text-white shadow-md">
                    <p className="text-sm font-semibold">福</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#9A4E1A] shadow">
                      손님
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#9A4E1A] shadow">
                      홍보글
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#9A4E1A] shadow">
                      해시태그
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-[#6A5747]">
                사장님 가게에 복과 손님을 불러오는 작은 아기 도깨비. 복이는
                어려운 홍보 대신, 바로 쓸 수 있는 마케팅 문구를 만들어드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B26A36]">
            Problem
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            가게 홍보, 이런 점이 늘 어렵지 않으셨나요?
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#5A4A3D]">
            장사도 바쁜데 홍보까지 직접 챙기려면 생각보다 에너지가 많이 듭니다.
            복덩이 AI는 바로 이 지점을 덜어드리기 위해 만들어졌습니다.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {problems.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[#F0DDC8] bg-white p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1D6] text-lg">
                ✦
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#5A4A3D]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="border-y border-[#F1E3D3] bg-[#FFF3E6]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B26A36]">
              Solution
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              복덩이 AI는 사장님 가게에 맞는 홍보 글을 만들어드립니다
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5A4A3D]">
              가게 업종, 분위기, 메뉴나 서비스 정보를 입력하면 복덩이 AI가 바로
              사용할 수 있는 마케팅 문구를 추천합니다.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-[#F0DDC8]"
              >
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#5A4A3D]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B26A36]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            복이는 이렇게 일합니다
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-[28px] border border-[#F0DDC8] bg-white p-6"
            >
              <p className="text-sm font-bold text-[#D94841]">{item.step}</p>
              <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#5A4A3D]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Example outputs */}
      <section className="bg-[#FFF3E6]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B26A36]">
              Example
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              이렇게 바로 쓸 수 있는 문구가 만들어집니다
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {examples.map((item, idx) => (
              <div
                key={`${item.business}-${idx}`}
                className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-[#F0DDC8]"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#FFF8F1] p-5">
                    <p className="text-sm font-semibold text-[#9A4E1A]">
                      입력 정보
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5A4A3D]">
                      <li>
                        <span className="font-semibold">업종:</span>{" "}
                        {item.business}
                      </li>
                      <li>
                        <span className="font-semibold">분위기:</span>{" "}
                        {item.mood}
                      </li>
                      <li>
                        <span className="font-semibold">목적:</span> {item.goal}
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-[#FFF1D6] p-5">
                    <p className="text-sm font-semibold text-[#9A4E1A]">
                      생성 결과
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#5A4A3D]">
                      {item.output}
                    </p>
                    <p className="mt-4 text-sm font-medium text-[#D94841]">
                      {item.hashtags}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B26A36]">
              Why Bokdeongi AI
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              복잡한 마케팅 지식 없이도 괜찮습니다
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5A4A3D]">
              복덩이 AI는 전문 용어보다 사장님이 바로 쓸 수 있는 결과를 만드는
              데 집중했습니다. 어렵게 배우기보다, 바로 써먹을 수 있어야 합니다.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#F0DDC8]">
                어려운 설정 없이 시작 가능
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#F0DDC8]">
                복사해서 바로 올릴 수 있는 결과
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#F0DDC8]">
                사장님 가게에 맞는 문구 추천
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#F0DDC8] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#B26A36]">
              마스코트 소개
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              사장님 가게의 작은 복덩이, 복이
            </h3>
            <p className="mt-4 leading-8 text-[#5A4A3D]">
              복이는 사장님 가게에 손님과 활기를 불러오는 아기 도깨비입니다.
              어려운 홍보는 대신 맡기고, 사장님은 장사에 더 집중하세요.
            </p>

            <div className="mt-8 flex items-center justify-center rounded-[24px] bg-[#FFF7EC] p-8">
              <div className="flex flex-col items-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#FFD8B5]">
                  <div className="absolute -top-2 left-5 h-5 w-5 rounded-full bg-[#D94841]" />
                  <div className="absolute -top-2 right-5 h-5 w-5 rounded-full bg-[#D94841]" />
                  <div className="flex gap-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#2B2118]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#2B2118]" />
                  </div>
                  <div className="absolute bottom-8 h-2.5 w-8 rounded-full bg-[#B95A50]" />
                </div>
                <div className="mt-3 rounded-2xl bg-[#D94841] px-4 py-3 text-white">
                  福
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[#F1E3D3] bg-[#2B2118]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-white md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F6C344]">
              Start now
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">
              이제 홍보 글 때문에 고민하지 마세요
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/80">
              사장님 가게에 맞는 문구를 복덩이 AI가 빠르게 만들어드립니다.
              장사는 사장님이, 홍보는 복이가 도와드립니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-[#D94841] px-6 py-4 text-base font-semibold text-white transition hover:opacity-95">
                무료로 시작하기
              </button>
              <button className="rounded-2xl border border-white/20 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/5">
                샘플 결과 보기
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
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
