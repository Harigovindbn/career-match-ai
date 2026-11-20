import type { Metadata } from "next";

import InfoPage from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Service"
      intro={<p>By creating an account or using CareerMatch AI you agree to these terms.</p>}
      sections={[
        {
          heading: "Using the service",
          body: (
            <p>CareerMatch AI provides tools to analyse and improve resumes and to explore job fit. You are responsible for the accuracy of the information you upload and for keeping your password secure.</p>
          ),
        },
        {
          heading: "AI-generated content",
          body: (
            <p>Scores, suggestions and AI assistant replies are automated guidance, not professional advice or a guarantee of interview or hiring outcomes. Review every suggestion before using it, and never add claims to your resume that are not true.</p>
          ),
        },
        {
          heading: "Your content",
          body: (
            <p>You keep ownership of the resumes and text you upload. You allow the service to process that content solely to provide its features to you.</p>
          ),
        },
        {
          heading: "Acceptable use",
          body: (
            <p>Do not misuse the service, attempt to access other users&apos; data, or upload content you do not have the right to share.</p>
          ),
        },
      ]}
    />
  );
}
