-- Run this FIRST to clean up any partial tables
-- Only run if you got errors during initial setup

DROP TABLE IF EXISTS rankings CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS round_status CASCADE;
DROP TABLE IF EXISTS news_cards CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Now you can run supabase-schema.sql again
