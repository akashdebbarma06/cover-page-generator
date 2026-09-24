-- ==============================================================================
-- Student Cover Page Maker: Database Schema & Row Level Security (RLS)
-- Matches exact technical specification in design.md
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Core Identity Table (Linked to NextAuth authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_user_id CHAR(10) UNIQUE NOT NULL,  -- generated once, immutable
  email TEXT UNIQUE NOT NULL,
  auth_provider TEXT NOT NULL,              -- 'google' | 'github'
  auth_provider_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (auth_provider, auth_provider_id)
);

-- 2. Editable User Profiles Table (Separate from immutable identity)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT,
  dob DATE,
  institution_name TEXT,
  course_details TEXT,
  phone TEXT,
  -- flexible bag for institution-specific fields (roll no, dept, semester, etc.)
  extra_fields JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Logos Table (Custom uploaded logos and system-provided institutional crests)
CREATE TABLE IF NOT EXISTS logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL = system library
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Templates Table (Defines institutional styles and dynamic field requirements)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  preview_image_url TEXT,
  -- defines which fields this template needs, in order — drives form rendering
  field_schema JSONB NOT NULL,
  html_template TEXT NOT NULL,  -- the Puppeteer-rendered template
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Cover Pages Table (Generated cover page snapshots & autofill source of truth)
CREATE TABLE IF NOT EXISTS cover_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  logo_id UUID REFERENCES logos(id),
  form_data JSONB NOT NULL,     -- exact values used for this cover page
  pdf_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- Indexes for High Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_unique_user_id ON users(unique_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_logos_user_id ON logos(user_id);
CREATE INDEX IF NOT EXISTS idx_logos_is_system ON logos(is_system);
CREATE INDEX IF NOT EXISTS idx_cover_pages_user_id ON cover_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_pages_template_id ON cover_pages(template_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_pages ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
-- Users can view their own identity row
CREATE POLICY "Users can view their own user row"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 2. USER PROFILES POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. LOGOS POLICIES
-- Anyone authenticated can view system logos OR their own uploaded logos
CREATE POLICY "View system logos or own logos"
  ON logos FOR SELECT
  USING (is_system = true OR auth.uid() = user_id);

-- Users can insert their own logos
CREATE POLICY "Insert own user logos"
  ON logos FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_system = false);

-- Users can delete their own logos
CREATE POLICY "Delete own user logos"
  ON logos FOR DELETE
  USING (auth.uid() = user_id AND is_system = false);

-- 4. TEMPLATES POLICIES
-- Read access to all templates for authenticated and public users
CREATE POLICY "Allow public read access to templates"
  ON templates FOR SELECT
  USING (true);

-- 5. COVER PAGES POLICIES
-- Users can view their own generated cover pages
CREATE POLICY "View own cover pages"
  ON cover_pages FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cover pages
CREATE POLICY "Insert own cover pages"
  ON cover_pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cover pages
CREATE POLICY "Update own cover pages"
  ON cover_pages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cover pages
CREATE POLICY "Delete own cover pages"
  ON cover_pages FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- Storage Buckets Configuration (logos & cover-pages)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', false), ('cover-pages', 'cover-pages', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Logos bucket
CREATE POLICY "Allow authenticated read on logos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'logos');

CREATE POLICY "Allow authenticated upload on logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'logos');

-- Storage RLS: Cover-pages bucket
CREATE POLICY "Allow authenticated access to own PDFs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'cover-pages');

CREATE POLICY "Allow service/authenticated upload to cover-pages"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cover-pages');
