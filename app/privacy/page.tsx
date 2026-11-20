import type { Metadata } from "next";

import InfoPage from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={<p>This page explains what information CareerMatch AI stores and how it is used.</p>}
      sections={[
        {
          heading: "Information we store",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Account details: your name, email address and a securely hashed password (managed by Supabase Auth).</li>
              <li>Profile details you choose to add, such as job title, location, phone number and links.</li>
              <li>Resumes you upload (PDF or DOCX), the text extracted from them, and the analysis results.</li>
              <li>Resume optimizations you choose to save.</li>
            </ul>
          ),
        },
        {
          heading: "How your information is used",
          body: (
            <>
              <p>Your data is used only to provide the app&apos;s features: ATS scoring, job matching, resume optimization and the AI career assistant.</p>
              <p>When you use AI features, the relevant text (for example your question or resume bullet points) is sent to Google&apos;s Gemini API to generate a response.</p>
            </>
          ),
        },
        {
          heading: "Storage and security",
          body: (
            <p>Data is stored in Supabase with row-level security so that each account can access only its own records and files. Resume files are kept in a private storage bucket.</p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <p>You can edit your profile, update your email or password in Settings, and delete uploaded resumes and saved optimizations at any time.</p>
          ),
        },
      ]}
    />
  );
}
