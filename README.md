# Career Match AI 

A modern, production-grade AI-powered career optimization and resume platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **Google Gemini / Server Actions**. 

Designed to help job seekers bypass ATS filters, optimize bullet points, track applications, and consult an AI career coach in real-time.

---

##  Key Features

- ** Interactive AI Career Assistant (`/ai-assistant`):** Real-time streaming chat interface providing expert guidance on interview prep, salary negotiation, and resume strategies.
- ** Real ATS Scoring Engine (`/ats-score`):** Upload or paste resume text to evaluate keyword compatibility against target roles and receive automated improvement tips.
- ** Live Job Match Explorer (`/job-match`):** Browse curated job openings ranked instantly by resume compatibility scores and matching tags.
- ** Client-Side PDF Resume Builder (`/resume`):** Format your professional experience into a clean, ATS-compliant layout and download it instantly as a PDF.
- ** AI Resume Optimizer (`/resume-optimizer`):** Transform passive duty descriptions into high-impact, metrics-driven achievement bullets with persistent database history tracking.
- **⚙️ Secure Account Settings (`/settings`):** Manage profile preferences, notifications, and security authentication backed by Supabase.

---

##  Tech Stack

- **Frontend & Routing:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons
- **Backend & Database:** Supabase (Auth & PostgreSQL), Next.js Server Actions
- **AI & Integrations:** Google Gemini API / Vercel AI Patterns, `jsPDF` / `html2canvas` for document export

---

##  Getting Started

### Prerequisites
Make sure you have **Node.js** installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/Harigovindbn/career-match-ai.git](https://github.com/Harigovindbn/career-match-ai.git)
   cd career-match-ai


   Install dependencies:

Bash
npm install
Set up your environment variables:
Create a .env.local file in the root directory and add your Supabase and Gemini credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
Run the development server:

Bash
npm run dev
Open http://localhost:3000 with your browser to view the app.

📄 License
Distributed under the MIT License. See LICENSE for more information.
