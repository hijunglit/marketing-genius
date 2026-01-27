-- Seed file for marketing-genius database
-- Note: 'profiles' table is NOT seeded - using existing profile_id: ad2b1d2d-0365-4a5a-a0ae-7be1757c347f

-- =============================================
-- Seed: contents (5 rows)
-- =============================================
INSERT INTO "contents" ("text", "hashtag")
VALUES
  ('Discover the future of marketing with AI-powered content creation. Transform your brand story into engaging posts that resonate with your audience.', '#AIMarketing #ContentCreation #DigitalStrategy'),
  ('Boost your social media presence with data-driven insights. Our platform analyzes trends and creates content that converts followers into customers.', '#SocialMedia #DataDriven #MarketingTips'),
  ('Say goodbye to creative blocks! Generate stunning marketing copy in seconds. Perfect for busy entrepreneurs and marketing teams.', '#Productivity #MarketingAutomation #Entrepreneurship'),
  ('Your brand deserves content that stands out. Let AI craft compelling narratives that capture attention and drive engagement.', '#BrandBuilding #ContentMarketing #AI'),
  ('From concept to publication in minutes. Streamline your content workflow and focus on what matters most - growing your business.', '#WorkflowOptimization #BusinessGrowth #MarketingTools');

-- =============================================
-- Seed: ai (5 rows)
-- Uses profiles_id: ad2b1d2d-0365-4a5a-a0ae-7be1757c347f
-- =============================================
INSERT INTO "ai" ("profiles_id", "create_prompt")
VALUES
  ('ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 'You are a professional marketing copywriter. Create engaging social media content that is concise, compelling, and includes a clear call-to-action. Focus on benefits over features.'),
  ('ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 'You are a creative content strategist specializing in Instagram posts. Write captions that are visually descriptive, emotionally engaging, and optimized for hashtag discovery.'),
  ('ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 'You are a B2B marketing expert. Create professional LinkedIn content that establishes thought leadership and drives business connections. Use industry terminology appropriately.'),
  ('ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 'You are a viral content creator for TikTok and short-form video platforms. Write scripts that are entertaining, hook viewers in the first 3 seconds, and encourage shares.'),
  ('ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 'You are an email marketing specialist. Craft compelling email subject lines and body copy that increase open rates and click-through rates. Focus on personalization and urgency.');

-- =============================================
-- Seed: images (5 rows)
-- References contents_id: 1-5 (auto-generated from above)
-- =============================================
INSERT INTO "images" ("image_url", "contents_id")
VALUES
  ('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 1),
  ('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', 1),
  ('https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800', 2),
  ('https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800', 3),
  ('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', 4);

-- =============================================
-- Seed: request_contents (5 rows)
-- References: contents_id (1-5), ai_id (1-5)
-- Uses profile_id: ad2b1d2d-0365-4a5a-a0ae-7be1757c347f
-- =============================================
INSERT INTO "request_contents" ("contents_id", "profile_id", "ai_id", "title", "platform", "template", "product_name", "target", "core_message", "is_confirm")
VALUES
  (1, 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 1, 'AI Marketing Launch Campaign', 'Instagram', 'product-launch', 'Marketing Genius Pro', 'Small business owners aged 25-45', 'Revolutionize your marketing with AI-powered content creation', true),
  (2, 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 2, 'Social Media Growth Series', 'Instagram', 'educational', 'Marketing Genius Analytics', 'Social media managers and influencers', 'Data-driven insights for exponential social growth', true),
  (3, 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 3, 'B2B Lead Generation Post', 'LinkedIn', 'thought-leadership', 'Marketing Genius Enterprise', 'Marketing directors at mid-size companies', 'Enterprise-grade marketing automation for serious results', false),
  (4, 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 4, 'Brand Awareness Campaign', 'TikTok', 'viral-hook', 'Marketing Genius App', 'Gen Z entrepreneurs and side hustlers', 'Create scroll-stopping content in seconds', true),
  (5, 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', 5, 'Email Newsletter Promo', 'Email', 'newsletter', 'Marketing Genius Suite', 'Existing customers and newsletter subscribers', 'Unlock the full potential of your marketing stack', false);
