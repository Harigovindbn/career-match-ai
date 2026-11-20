# CareerMatch AI

An AI-powered career platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Supabase** and **Google Gemini**. Upload a resume, get an ATS score, compare it against a job description, rewrite weak bullet points and chat with an AI career coach.

---

## Features

| Page | What it does |
| --- | --- |
| **Dashboard** (`/dashboard`) | Profile completion, latest resume score, recent activity and quick actions. |
| **Profile** (`/profile`) | Name, title, location, bio and LinkedIn / GitHub / portfolio links. |
| **Resume** (`/resume`) | Upload, replace or delete a PDF/DOCX resume (max 5 MB). Text is extracted and analysed automatically. |
| **ATS Score** (`/ats-score`) | Scores your uploaded (or pasted) resume on contact info, sections, keywords, formatting and impact, with recommendations. |
| **Resume Optimizer** (`/resume-optimizer`) | Compares your resume with a job description, shows matching / missing skills, rewrites bullets with Gemini and saves optimizations to your history. |
| **Job Match** (`/job-match`) | Match score, skill and keyword gaps between a resume and a job description. |
| **AI Assistant** (`/ai-assistant`) | Streaming Gemini career coach for resumes, interviews, salary negotiation and job search. |
| **Settings** (`/settings`) | Update name, email (with confirmation), password (current password verified), notification preference and theme. |
| **Auth** (`/auth/*`) | Sign up with email confirmation, sign in, forgot / reset password. |

---

## Tech stack

- **Frontend:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Lucide icons
- **Backend:** Next.js Server Actions and Route Handlers, `proxy.ts` for Supabase session refresh
- **Database / Auth / Storage:** Supabase (PostgreSQL with Row Level Security, Auth, private `resumes` bucket)
- **AI:** Google Gemini via `@google/generative-ai` (uses `-latest` model aliases with automatic fallback)
- **Parsing:** `pdf-parse` (PDF) and `mammoth` (DOCX)
- **Testing / CI:** Vitest, ESLint, GitHub Actions

---

## Getting started

### 1. Prerequisites

- Node.js 20.9 or newer
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com/apikey) Gemini API key

### 2. Install

```bash
git clone https://github.com/Harigovindbn/career-match-ai.git
cd career-match-ai
npm install
```

### 3. Environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key

# Optional
# GEMINI_MODEL=gemini-flash-latest          # preferred Gemini model (falls back automatically)
# NEXT_PUBLIC_SITE_URL=https://your-domain   # base URL used in auth email links
```

`.env*` files are git-ignored. Never commit real keys.

### 4. Set up Supabase

1. **Tables:** the app uses `profiles`, `resumes` and `resume_optimizations`, plus a private storage bucket named `resumes`.
2. **Security (required):** open **SQL Editor** in the Supabase dashboard and run
   [`supabase/migrations/20261120000000_enable_rls.sql`](supabase/migrations/20261120000000_enable_rls.sql).
   It enables Row Level Security so each user can only access their own rows and files, and adds a trigger that creates a profile for every new user.
3. **Auth redirect URLs:** in **Authentication → URL Configuration**, add
   `http://localhost:3000/auth/callback` and `https://<your-domain>/auth/callback`
   so sign-up confirmation and password-reset links work.

### 5. Run

```bash
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint
npm test         # Vitest unit tests
```

---

## Project structure

```
app/
  (protected)/        Signed-in pages (dashboard, profile, resume, ats-score,
                      resume-optimizer, job-match, ai-assistant, settings)
  api/chat/           Streaming Gemini chat endpoint (auth required)
  auth/               login, sign-up, callback, reset-password, update-password
  privacy/ terms/ contact/
components/           UI grouped by feature
lib/
  ai/gemini.ts        Gemini client, model fallback, bullet rewriting, chat streaming
  ats/                ATS scoring engine
  job-match/          Job match scoring engine
  resume/             Text extraction and resume analysis
  resume-optimizer/   Keyword engine and optimized resume builder (with tests)
  supabase/           Browser and server Supabase clients
proxy.ts              Refreshes the Supabase session on each request
supabase/migrations/  SQL for Row Level Security and the profile trigger
```

---

## Deployment (Vercel)

1. Import the repository into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `GEMINI_API_KEY` (optionally `NEXT_PUBLIC_SITE_URL`) under **Settings → Environment Variables**.
3. Add your production `/auth/callback` URL to Supabase's redirect URLs.

For CI, add the same values as GitHub repository secrets. The build falls back to placeholders if they're missing.

---

## License

MIT
