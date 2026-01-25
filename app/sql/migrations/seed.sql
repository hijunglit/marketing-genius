-- Seed file for marketing-genius database
-- Profile ID to use: aba0f396-a2a2-4cb9-abdb-efb0bee6d846
-- Note: profiles table is NOT seeded (assumed to exist)

-- ============================================
-- Seed AI table (5 rows)
-- ============================================
INSERT INTO "ai" ("profiles_id", "create_prompt", "created_at", "updated_at")
VALUES
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Create engaging social media content for a tech startup launch', '2025-01-10 10:00:00', '2025-01-10 10:00:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Generate email marketing campaign for summer sale promotion', '2025-01-12 14:30:00', '2025-01-12 14:30:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Write compelling blog post about AI trends in 2025', '2025-01-15 09:15:00', '2025-01-15 09:15:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Create product description for new smartphone accessories', '2025-01-18 16:45:00', '2025-01-18 16:45:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Generate Instagram captions for travel photography brand', '2025-01-20 11:20:00', '2025-01-20 11:20:00');

-- ============================================
-- Seed contents table (5 rows)
-- ============================================
INSERT INTO "contents" ("profile_id", "request_prompt", "text", "created_at", "updated_at")
VALUES
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Create a marketing headline for eco-friendly products', 'Go Green, Live Clean: Sustainable Solutions for a Better Tomorrow. Our eco-friendly products help you reduce your carbon footprint while maintaining the quality you deserve.', '2025-01-11 08:00:00', '2025-01-11 08:00:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Write social media post for fitness app launch', 'Ready to transform your fitness journey? Our new app brings personalized workouts, nutrition tracking, and community support right to your fingertips. Download now and get your first month FREE! #FitnessGoals #HealthyLifestyle', '2025-01-13 12:00:00', '2025-01-13 12:00:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Generate newsletter intro for software company', 'Welcome to our January newsletter! This month, we are excited to share our latest product updates, industry insights, and exclusive tips from our development team to help you maximize productivity.', '2025-01-16 10:30:00', '2025-01-16 10:30:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Create ad copy for online learning platform', 'Learn Anything, Anytime, Anywhere. Join millions of learners worldwide and unlock your potential with expert-led courses. Start your journey today with 50% off your first subscription!', '2025-01-19 15:00:00', '2025-01-19 15:00:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 'Write product announcement for AI assistant tool', 'Introducing MarketingGenius AI - Your intelligent marketing companion. Automate content creation, analyze campaign performance, and boost engagement with cutting-edge artificial intelligence.', '2025-01-21 09:45:00', '2025-01-21 09:45:00');

-- ============================================
-- Seed images table (5 rows)
-- References contents_id 1-5 from above inserts
-- ============================================
INSERT INTO "images" ("image_url", "contents_id")
VALUES
  ('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', 1),
  ('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 2),
  ('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 3),
  ('https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800', 4),
  ('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', 5);

-- ============================================
-- Seed request_contents table (5 rows)
-- References ai_id 1-5 from above inserts
-- ============================================
INSERT INTO "request_contents" ("user_id", "ai_id", "request_prompt", "is_confirm", "created_at")
VALUES
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 1, 'Generate 3 variations of social media posts for tech startup', true, '2025-01-10 10:30:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 2, 'Create email subject lines for summer promotion campaign', true, '2025-01-12 15:00:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 3, 'Write introduction paragraph for AI trends blog post', false, '2025-01-15 09:45:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 4, 'Generate SEO-optimized product descriptions', true, '2025-01-18 17:15:00'),
  ('aba0f396-a2a2-4cb9-abdb-efb0bee6d846', 5, 'Create hashtag suggestions for travel photography', true, '2025-01-20 11:50:00');
