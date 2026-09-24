-- ==============================================================================
-- STUDENT COVER PAGE MAKER: COMPLETE DATABASE & TEMPLATE SETUP
-- Run this script once in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Core Identity Table (Linked to NextAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_user_id CHAR(10) UNIQUE NOT NULL,  -- generated once, immutable
  email TEXT UNIQUE NOT NULL,
  auth_provider TEXT NOT NULL,              -- 'google' | 'github'
  auth_provider_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (auth_provider, auth_provider_id)
);

-- 3. Editable User Profiles Table (Separate from immutable identity)
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

-- 4. Logos Table (Custom uploaded logos and system-provided institutional crests)
CREATE TABLE IF NOT EXISTS logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL = system library
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Templates Table (Defines institutional styles and dynamic field requirements)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  preview_image_url TEXT,
  -- defines which fields this template needs, in order — drives form rendering
  field_schema JSONB NOT NULL,
  html_template TEXT NOT NULL,  -- the Puppeteer-rendered template
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Cover Pages Table (Generated cover page snapshots & autofill source of truth)
CREATE TABLE IF NOT EXISTS cover_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  logo_id UUID REFERENCES logos(id),
  form_data JSONB NOT NULL,     -- exact values used for this cover page
  pdf_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_unique_user_id ON users(unique_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_logos_user_id ON logos(user_id);
CREATE INDEX IF NOT EXISTS idx_logos_is_system ON logos(is_system);
CREATE INDEX IF NOT EXISTS idx_cover_pages_user_id ON cover_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_pages_template_id ON cover_pages(template_id);

-- 8. Row Level Security (RLS) Enablement
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_pages ENABLE ROW LEVEL SECURITY;

-- 8b. Grant schema & table permissions to Supabase roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 9. RLS Policies
DROP POLICY IF EXISTS "Users can view their own user row" ON users;
CREATE POLICY "Users can view their own user row" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "View system logos or own logos" ON logos;
CREATE POLICY "View system logos or own logos" ON logos FOR SELECT USING (is_system = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Insert own user logos" ON logos;
CREATE POLICY "Insert own user logos" ON logos FOR INSERT WITH CHECK (auth.uid() = user_id AND is_system = false);

DROP POLICY IF EXISTS "Delete own user logos" ON logos;
CREATE POLICY "Delete own user logos" ON logos FOR DELETE USING (auth.uid() = user_id AND is_system = false);

DROP POLICY IF EXISTS "Allow public read access to templates" ON templates;
CREATE POLICY "Allow public read access to templates" ON templates FOR SELECT USING (true);

DROP POLICY IF EXISTS "View own cover pages" ON cover_pages;
CREATE POLICY "View own cover pages" ON cover_pages FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Insert own cover pages" ON cover_pages;
CREATE POLICY "Insert own cover pages" ON cover_pages FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Update own cover pages" ON cover_pages;
CREATE POLICY "Update own cover pages" ON cover_pages FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Delete own cover pages" ON cover_pages;
CREATE POLICY "Delete own cover pages" ON cover_pages FOR DELETE USING (auth.uid() = user_id);

-- 10. Storage Buckets (logos & cover-pages)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', false), ('cover-pages', 'cover-pages', false)
ON CONFLICT (id) DO NOTHING;

-- 11. Seed Institutional Templates
INSERT INTO templates (id, name, preview_image_url, field_schema, html_template)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Standard Institutional A4',
  '/templates/standard-a4.png',
  '[
    {"name": "institutionName", "label": "Institution Name", "type": "text", "required": true, "placeholder": "NATIONAL INSTITUTE OF TECHNOLOGY", "section": "personal"},
    {"name": "department", "label": "Department Name", "type": "text", "required": true, "placeholder": "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", "section": "course"},
    {"name": "submissionType", "label": "Submission Type", "type": "text", "required": true, "placeholder": "LAB REPORT / PRACTICAL RECORD", "section": "assignment"},
    {"name": "assignmentTitle", "label": "Assignment Title", "type": "text", "required": true, "placeholder": "Implementation & Benchmarking of Raft Consensus in Distributed Environments", "section": "assignment"},
    {"name": "assignmentSubtitle", "label": "Assignment Subtitle (Optional)", "type": "text", "required": false, "placeholder": "Practical Laboratory Session 04 - High-Availability Clusters", "section": "assignment"},
    {"name": "subjectCode", "label": "Subject Code", "type": "text", "required": true, "placeholder": "CS-504", "section": "course"},
    {"name": "subject", "label": "Subject Name", "type": "text", "required": true, "placeholder": "Distributed Systems & Cloud Computing", "section": "course"},
    {"name": "semester", "label": "Semester / Session", "type": "text", "required": true, "placeholder": "Semester V (Autumn 2024)", "section": "course"},
    {"name": "fullName", "label": "Student Full Name", "type": "text", "required": true, "placeholder": "Alex Morgan", "section": "personal"},
    {"name": "rollNo", "label": "Roll Number", "type": "text", "required": true, "placeholder": "CS22B1044", "section": "personal"},
    {"name": "studentId", "label": "Student ID", "type": "text", "required": true, "placeholder": "STU-2022-84920", "section": "personal"},
    {"name": "registrationNo", "label": "Registration No.", "type": "text", "required": false, "placeholder": "REG-8829104", "section": "personal"},
    {"name": "facultyName", "label": "Faculty / Instructor Name", "type": "text", "required": true, "placeholder": "Dr. Evelyn Vance, Ph.D.", "section": "faculty"},
    {"name": "facultyDesignation", "label": "Faculty Designation", "type": "text", "required": true, "placeholder": "Associate Professor & Head of Lab", "section": "faculty"},
    {"name": "secondFacultyName", "label": "Second Faculty Name (Optional)", "type": "text", "required": false, "placeholder": "Prof. Marcus Thorne", "section": "faculty"},
    {"name": "secondFacultyDesignation", "label": "Second Faculty Designation (Optional)", "type": "text", "required": false, "placeholder": "Assistant Professor", "section": "faculty"},
    {"name": "submissionDate", "label": "Submission Date", "type": "date", "required": true, "placeholder": "2024-11-05", "section": "assignment"}
  ]'::jsonb,
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@page{size:A4;margin:25mm 20mm 20mm 20mm}body{font-family:"Times New Roman",Times,serif;color:#111;margin:0;padding:0}.header{text-align:center;border-bottom:2px solid #800020;padding-bottom:15px;margin-bottom:30px}.inst{font-size:18pt;font-weight:bold;text-transform:uppercase;color:#800020;letter-spacing:1px}.dept{font-size:12pt;text-transform:uppercase;color:#333;margin-top:5px}.sub-type{text-align:center;font-size:13pt;font-weight:bold;letter-spacing:2px;color:#555;margin-top:40px;text-transform:uppercase}.title-box{text-align:center;margin:30px 0 50px 0}.title{font-size:20pt;font-weight:bold;line-height:1.3;color:#000}.subtitle{font-size:13pt;font-style:italic;color:#444;margin-top:10px}.course-box{text-align:center;font-size:12pt;color:#333;margin-bottom:60px}.grid{display:flex;justify-content:space-between;margin-top:auto;padding-top:30px;border-top:1px solid #ccc;font-family:Arial,sans-serif;font-size:10pt}.col{width:48%}.col-right{text-align:right}.label{font-weight:bold;color:#800020;text-transform:uppercase;font-size:9pt;margin-bottom:4px}.val{margin-bottom:3px}.footer{margin-top:40px;display:flex;justify-content:space-between;font-size:9pt;font-family:Arial,sans-serif;border-top:1px dashed #999;padding-top:15px}.sig-line{width:180px;border-top:1px solid #333;margin-top:40px;padding-top:5px;text-align:center;font-size:8pt;font-weight:bold}</style></head><body><div class="header">{{logoHtml}}<div class="inst">{{institutionName}}</div><div class="dept">{{department}}</div></div><div class="sub-type">{{submissionType}}</div><div class="title-box"><div class="title">{{assignmentTitle}}</div>{{#assignmentSubtitle}}<div class="subtitle">{{assignmentSubtitle}}</div>{{/assignmentSubtitle}}</div><div class="course-box"><strong>Subject:</strong> {{subjectCode}} &mdash; {{subject}}<br><strong>Session:</strong> {{semester}}</div><div class="grid"><div class="col"><div class="label">Submitted By:</div><div class="val" style="font-size:12pt;font-weight:bold">{{fullName}}</div><div class="val"><strong>Roll No:</strong> {{rollNo}}</div><div class="val"><strong>Student ID:</strong> {{studentId}}</div>{{#registrationNo}}<div class="val"><strong>Reg No:</strong> {{registrationNo}}</div>{{/registrationNo}}</div><div class="col col-right"><div class="label">Submitted To:</div><div class="val" style="font-size:12pt;font-weight:bold">{{facultyName}}</div><div class="val">{{facultyDesignation}}</div>{{#secondFacultyName}}<div style="margin-top:10px"><div class="val" style="font-weight:bold">{{secondFacultyName}}</div><div class="val">{{secondFacultyDesignation}}</div></div>{{/secondFacultyName}}<div class="val" style="margin-top:10px"><strong>Date:</strong> {{submissionDate}}</div></div></div><div class="footer"><div class="sig-line">STUDENT SIGNATURE</div><div class="sig-line">FACULTY EVALUATION & MARKS</div></div></body></html>'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Modern Academic Minimal',
  '/templates/academic-minimal.png',
  '[
    {"name": "assignmentTitle", "label": "Paper / Essay Title", "type": "text", "required": true, "placeholder": "Rethinking Epistemic Authority in Networked Democracies", "section": "assignment"},
    {"name": "assignmentSubtitle", "label": "Subtitle", "type": "text", "required": false, "placeholder": "A Critical Inquiry in Philosophy of Technology", "section": "assignment"},
    {"name": "fullName", "label": "Author Full Name", "type": "text", "required": true, "placeholder": "Claire Devereux", "section": "personal"},
    {"name": "institutionName", "label": "Department & Institution", "type": "text", "required": true, "placeholder": "Department of Philosophy, University of Cambridge", "section": "personal"},
    {"name": "subject", "label": "Course Name", "type": "text", "required": true, "placeholder": "PHIL-3100: Philosophy of Science & Politics", "section": "course"},
    {"name": "facultyName", "label": "Instructor / Advisor", "type": "text", "required": true, "placeholder": "Prof. Julian Sterling", "section": "faculty"},
    {"name": "submissionDate", "label": "Due Date", "type": "date", "required": true, "placeholder": "2024-10-24", "section": "assignment"}
  ]'::jsonb,
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@page{size:letter;margin:1in}body{font-family:"Georgia",serif;color:#1a1a1a;line-height:2;margin:0;padding:0;display:flex;flex-direction:column;min-height:100vh}.header-num{text-align:right;font-size:10pt;font-family:"Courier New",monospace}.content{margin:auto 0;text-align:center}.title{font-size:22pt;font-weight:bold;line-height:1.3;margin-bottom:10px}.subtitle{font-size:14pt;font-style:italic;color:#444;margin-bottom:50px}.meta{font-size:12pt}.meta div{margin-bottom:4px}</style></head><body><div class="header-num">1</div><div class="content"><div class="title">{{assignmentTitle}}</div>{{#assignmentSubtitle}}<div class="subtitle">{{assignmentSubtitle}}</div>{{/assignmentSubtitle}}<div class="meta"><div>{{fullName}}</div><div>{{institutionName}}</div><div>{{subject}}</div><div>{{facultyName}}</div><div>{{submissionDate}}</div></div></div></body></html>'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Technical Laboratory Formal',
  '/templates/technical-lab.png',
  '[
    {"name": "institutionName", "label": "Department / Laboratory", "type": "text", "required": true, "placeholder": "Department of Chemical Physics & Analytical Core", "section": "personal"},
    {"name": "assignmentTitle", "label": "Experiment Title", "type": "text", "required": true, "placeholder": "Spectrophotometric Determination of Reaction Kinetics", "section": "assignment"},
    {"name": "experimentNo", "label": "Experiment Number", "type": "text", "required": true, "placeholder": "EXP-088", "section": "assignment"},
    {"name": "benchNo", "label": "Bench / Station ID", "type": "text", "required": true, "placeholder": "Station #12", "section": "assignment"},
    {"name": "batchGroup", "label": "Batch / Group", "type": "text", "required": true, "placeholder": "B4-Group 3", "section": "course"},
    {"name": "fullName", "label": "Lead Investigator", "type": "text", "required": true, "placeholder": "Marcus Thorne", "section": "personal"},
    {"name": "rollNo", "label": "Student ID / Roll", "type": "text", "required": true, "placeholder": "2024-ME-091", "section": "personal"},
    {"name": "facultyName", "label": "Assigned Supervisor", "type": "text", "required": true, "placeholder": "Prof. A. Lindqvist", "section": "faculty"},
    {"name": "submissionDate", "label": "Performance Date", "type": "date", "required": true, "placeholder": "2024-10-24", "section": "assignment"}
  ]'::jsonb,
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@page{size:A4;margin:20mm}body{font-family:"Helvetica Neue",Arial,sans-serif;color:#222;margin:0;padding:0}.border-box{border:2px solid #222;padding:25px;min-height:90vh;display:flex;flex-direction:column;justify-content:space-between}.top-bar{display:flex;justify-content:space-between;font-size:10pt;font-family:monospace;border-bottom:1px solid #222;padding-bottom:10px}.exp-badge{background:#800020;color:#fff;padding:3px 8px;font-weight:bold}.center-content{text-align:center;margin:60px 0}.report-tag{font-size:11pt;letter-spacing:3px;font-weight:bold;color:#666}.title{font-size:22pt;font-weight:800;margin:15px 0}.table{width:100%;border-collapse:collapse;margin-top:30px;font-size:10pt}.table td{border:1px solid #999;padding:10px 12px}.table .label-td{background:#f5f5f5;font-weight:bold;width:30%}.sign-area{display:flex;justify-content:space-between;margin-top:50px;font-size:9pt}.sign-box{width:45%;border-top:1px solid #333;padding-top:6px;text-align:center}</style></head><body><div class="border-box"><div class="top-bar"><div>{{institutionName}}</div><div class="exp-badge">EXP NO: {{experimentNo}}</div></div><div class="center-content"><div class="report-tag">STANDARD LABORATORY REPORT</div><div class="title">{{assignmentTitle}}</div></div><table class="table"><tr><td class="label-td">Lead Investigator</td><td>{{fullName}} (ID: {{rollNo}})</td></tr><tr><td class="label-td">Batch / Workstation</td><td>Batch: {{batchGroup}} | Bench: {{benchNo}}</td></tr><tr><td class="label-td">Assigned Supervisor</td><td>{{facultyName}}</td></tr><tr><td class="label-td">Date Conducted</td><td>{{submissionDate}}</td></tr></table><div class="sign-area"><div class="sign-box">STUDENT SIGNATURE</div><div class="sign-box">FACULTY VERIFICATION & LAB GRADE</div></div></div></body></html>'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  field_schema = EXCLUDED.field_schema,
  html_template = EXCLUDED.html_template;
