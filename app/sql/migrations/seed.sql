-- Seed data for marketing-genius database
-- Profile ID used: ad2b1d2d-0365-4a5a-a0ae-7be1757c347f
-- Note: profiles table is NOT seeded (handled by auth trigger)

-- =============================================
-- Reset tables and restart identity sequences
-- CASCADE will also truncate dependent tables
-- =============================================
TRUNCATE TABLE request_contents RESTART IDENTITY CASCADE;
TRUNCATE TABLE images RESTART IDENTITY CASCADE;
TRUNCATE TABLE ai RESTART IDENTITY CASCADE;
TRUNCATE TABLE contents RESTART IDENTITY CASCADE;

-- =============================================
-- 1. Seed contents table (5 rows)
-- =============================================
INSERT INTO contents (text, hashtag) VALUES
(
  '새해 맞이 특별 할인 이벤트! 지금 바로 참여하세요. 최대 50% 할인된 가격으로 프리미엄 제품을 만나보세요.',
  '#신년이벤트 #할인 #특가 #프리미엄 #마케팅'
),
(
  '당신의 비즈니스를 한 단계 업그레이드하세요. AI 기반 마케팅 솔루션으로 효율적인 광고 캠페인을 진행해보세요.',
  '#AI마케팅 #비즈니스성장 #광고캠페인 #마케팅자동화'
),
(
  '고객의 마음을 사로잡는 콘텐츠 전략! SNS 마케팅의 핵심은 진정성 있는 스토리텔링입니다.',
  '#SNS마케팅 #콘텐츠전략 #스토리텔링 #브랜딩'
),
(
  '인스타그램 릴스로 브랜드 인지도를 높이세요. 짧고 임팩트 있는 영상으로 고객과 소통하세요.',
  '#인스타릴스 #숏폼콘텐츠 #브랜드마케팅 #영상마케팅'
),
(
  '블로그 마케팅의 정석! SEO 최적화된 콘텐츠로 검색 노출을 극대화하고 자연 유입을 늘리세요.',
  '#블로그마케팅 #SEO #검색최적화 #콘텐츠마케팅'
);

-- =============================================
-- 2. Seed ai table (5 rows)
-- Columns: profiles_id, company_name, category, core_service, company_description
-- =============================================
INSERT INTO ai (profiles_id, company_name, category, core_service, company_description) VALUES
(
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  '글로우 코스메틱',
  '뷰티/화장품',
  '프리미엄 스킨케어 제품 판매',
  '20대 여성을 타겟으로 한 자연 유래 성분의 프리미엄 스킨케어 브랜드입니다. 세련되고 감성적인 브랜딩으로 MZ세대에게 사랑받고 있습니다.'
),
(
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  '마케팅지니어스',
  'IT/SaaS',
  'AI 기반 마케팅 자동화 솔루션',
  '스타트업과 중소기업을 위한 B2B SaaS 마케팅 플랫폼입니다. AI를 활용하여 콘텐츠 생성, 광고 최적화, 성과 분석을 자동화합니다.'
),
(
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  '그린 바이탈',
  '건강식품',
  '프리미엄 단백질 보충제 판매',
  '건강에 관심 있는 30-40대를 위한 프리미엄 건강식품 브랜드입니다. 식물성 단백질과 비타민을 결합한 혁신적인 제품을 제공합니다.'
),
(
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  '런앤그로우 아카데미',
  '교육/에듀테크',
  '온라인 직무 교육 플랫폼',
  '직장인의 커리어 성장을 돕는 온라인 교육 플랫폼입니다. IT, 마케팅, 데이터 분석 등 실무 중심의 강의를 제공합니다.'
),
(
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  '카페 윈터블렌드',
  '외식/카페',
  '스페셜티 커피 및 디저트 판매',
  '감성적인 인테리어와 고품질 스페셜티 커피로 유명한 카페 브랜드입니다. 계절별 시그니처 메뉴로 20-30대 고객에게 인기가 많습니다.'
);

-- =============================================
-- 3. Seed images table (5 rows)
-- References contents_id 1-5
-- =============================================
INSERT INTO images (image_url, contents_id) VALUES
(
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
  1
),
(
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  2
),
(
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
  3
),
(
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
  4
),
(
  'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800',
  5
);

-- =============================================
-- 4. Seed request_contents table (5 rows)
-- References: contents_id 1-5, ai_id 1-5, profile_id
-- =============================================
INSERT INTO request_contents (contents_id, profile_id, ai_id, title, platform, template, product_name, target, core_message, is_confirm) VALUES
(
  1,
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  1,
  '새해 맞이 특별 할인 캠페인',
  'instagram',
  'promotional',
  '프리미엄 스킨케어 세트',
  '20-30대 여성',
  '새해를 맞아 자신에게 선물하는 뷰티 케어',
  true
),
(
  2,
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  2,
  'B2B SaaS 솔루션 홍보',
  'linkedin',
  'professional',
  'MarketingGenius Pro',
  '스타트업 대표 및 마케팅 담당자',
  'AI 기반 마케팅 자동화로 업무 효율 200% 향상',
  true
),
(
  3,
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  3,
  '건강식품 SNS 캠페인',
  'instagram',
  'lifestyle',
  '그린 바이탈 프로틴',
  '건강에 관심 있는 30-40대',
  '매일 활력 넘치는 하루를 위한 필수 영양',
  false
),
(
  4,
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  4,
  '온라인 교육 플랫폼 블로그',
  'blog',
  'educational',
  '런앤그로우 아카데미',
  '자기계발에 관심 있는 직장인',
  '퇴근 후 1시간으로 새로운 커리어를 준비하세요',
  true
),
(
  5,
  'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f',
  5,
  '카페 신메뉴 홍보',
  'instagram',
  'seasonal',
  '윈터 스페셜 라떼',
  '카페를 즐기는 20-30대',
  '추운 겨울, 따뜻한 한 잔으로 마음까지 포근하게',
  false
);
