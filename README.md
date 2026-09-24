# 🎓 Student Cover Page Maker & PDF Generator

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer--Core-Chromium_PDF-green?style=for-the-badge&logo=puppeteer)](https://pptr.dev/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-OAuth_Security-purple?style=for-the-badge)](https://next-auth.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Student Cover Page Maker** is an institutional-grade, registrar-compliant academic cover sheet generator. Built with **Next.js 14 App Router**, **Supabase**, and **Puppeteer Chromium**, it enables students and researchers to create, live-preview, and export vector-grade academic assignment cover pages in seconds.

---

## 🌟 Key Features

- ⚡ **One-Click Smart Autofill**: Configure your student credentials (Student ID, Roll No, Department, Course, Institution) once in your profile. Every cover page automatically populates instantly.
- 📊 **Autofill Readiness Gauge**: Real-time completeness meter that scores your student profile and highlights missing fields required for one-click generation.
- 🏛️ **Curated Academic Templates**:
  - **Standard Institutional A4**: Classical dual-bordered format with official crest placement, submission metadata, and signature blocks.
  - **Modern Academic Minimal**: Clean typographic hierarchy, contemporary sans-serif layout, and subtle geometric accents.
  - **Technical & Laboratory**: Engineered for lab experiments, engineering reports, code appendices, and group submissions.
- 👁️ **Live Interactive Preview**: Real-time side-by-side preview updating instantly as you type assignment titles, course codes, and instructor designations.
- 🖨️ **Vector-Grade PDF Engine**: Pixel-perfect A4/Letter print export powered by headless Chromium (`puppeteer-core` + `@sparticuz/chromium`) with embedded fonts and crisp vector graphics.
- 🏫 **Institutional Logo Library**: Built-in library of university and collegiate logos, alongside a custom emblem upload tool with preview cropping.
- 🔐 **Zero-Trust Security & RLS**: Strict Supabase Row Level Security (RLS) ensures students can only view and manage their own profiles and generated cover pages.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) | Server Actions, Route Handlers, SSR & React Server Components |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict end-to-end type safety |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + Lucide Icons | Responsive modern design system |
| **Authentication** | [NextAuth.js 4](https://next-auth.js.org/) | Secure OAuth (Google & GitHub) with session-based route protection |
| **Database** | [Supabase (PostgreSQL)](https://supabase.com/) | Relational storage with Row-Level Security (RLS) policies |
| **Storage** | Supabase Storage | High-speed cloud asset storage for institutional logos and generated PDFs |
| **PDF Generation**| [Puppeteer-Core](https://pptr.dev/) + [@sparticuz/chromium](https://github.com/Sparticuz/chromium) | Headless browser rendering HTML/CSS to print-ready PDF |
| **Validation** | [Zod](https://zod.dev/) | Client and server-side runtime schema validation |

---

## 🗄️ Database Schema & Security (Supabase)

The database schema is defined in [`supabase/migrations/20250101000000_init_schema.sql`](file:///c:/Users/Akash%20debbarma/Programming/Projects/cover%20page%20maker/supabase/migrations/20250101000000_init_schema.sql) and enforces strict **Row Level Security (RLS)**:

- `users`: Core immutable identity table storing unique 10-character identifiers (`unique_user_id`), email, and OAuth provider mappings.
- `user_profiles`: Editable profile containing full name, phone number, institution, course details, and dynamic `extra_fields` (JSONB) for semester, section, roll number, and department.
- `templates`: Canonical templates specifying field schemas, HTML boilerplate, and preview media.
- `logos`: System institutional crests and user-uploaded logos linked to Supabase Storage.
- `cover_pages`: History of user-generated cover sheets, stored form data snapshots, and generated PDF download paths.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.17.0 or later
- **npm** or **pnpm** / **yarn**
- A **Supabase** project (free tier works)
- Google and/or GitHub OAuth App credentials (for NextAuth)

### 2. Clone the Repository
```bash
git clone https://github.com/akashdebbarma06/cover-page-generator.git
cd cover-page-generator
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-secret-token"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 5. Initialize Database & Seed Templates
Run the SQL migration in your Supabase SQL editor:
1. Execute [`supabase/migrations/20250101000000_init_schema.sql`](file:///c:/Users/Akash%20debbarma/Programming/Projects/cover%20page%20maker/supabase/migrations/20250101000000_init_schema.sql) to create tables and RLS policies.
2. Execute [`supabase/seed.sql`](file:///c:/Users/Akash%20debbarma/Programming/Projects/cover%20page%20maker/supabase/seed.sql) to seed default templates.
3. *(Optional)* Seed institutional crests and test logos:
   ```bash
   node scripts/seed-institutional-logos.mjs
   ```

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Directory Structure

```text
cover-page-generator/
├── public/                 # Static assets, branding, and icons
├── scripts/                # Database seeding & PDF pipeline testing utilities
│   ├── seed-institutional-logos.mjs
│   ├── seed-logos.mjs
│   ├── test-pdf.mjs
│   └── test-pipeline.mjs
├── src/
│   ├── actions/            # Next.js Server Actions (Profile, PDF, Logos)
│   ├── app/                # App Router (Pages, Layouts & API Routes)
│   │   ├── (app)/          # Authenticated routes (create, dashboard, profile, preview)
│   │   ├── api/            # API endpoints (auth, pdf/generate, pdf/download, health)
│   │   ├── auth/signin/    # Authentication portal
│   │   └── page.tsx        # High-conversion landing page
│   ├── components/         # Modular React components
│   │   ├── brand/          # Application logo & iconography
│   │   ├── cover-page/     # Multi-step generation workflow
│   │   ├── forms/          # Dynamic template-driven forms
│   │   ├── layout/         # Navigation header and sidebar
│   │   ├── logos/          # Logo picker & search component
│   │   └── profile/        # Readiness gauge & profile fields
│   ├── lib/
│   │   ├── auth/           # NextAuth options & unique ID generation
│   │   ├── pdf/            # Cross-platform Chromium discovery & PDF renderer
│   │   ├── supabase/       # SSR & Admin Supabase clients + typed queries
│   │   ├── templates/      # Template mergers, slugs & HTML compiler
│   │   ├── types/          # Domain data types
│   │   └── validations/    # Zod schemas for user profile & cover sheet
│   └── middleware.ts       # Route guard middleware
├── supabase/               # SQL migrations and seed definitions
├── .env.example            # Environment configuration template
├── tailwind.config.ts      # Tailwind CSS theme configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts local Next.js development server with Turbopack / HMR |
| `npm run build` | Compiles optimized production bundle |
| `npm run start` | Boots production server |
| `npm run lint` | Runs Next.js ESLint verification |
| `node scripts/test-pdf.mjs` | Runs headless Chromium PDF test to verify local graphics engine |
| `node scripts/test-pipeline.mjs` | Validates end-to-end HTML compile and PDF generation pipeline |

---

## 🚢 Deployment (Vercel)

This application is ready for zero-configuration deployment to [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the repository into your Vercel Dashboard.
3. Configure the environment variables (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `SUPABASE_...`, OAuth IDs).
4. Click **Deploy**. Chromium support for PDF generation is handled automatically via `@sparticuz/chromium`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
