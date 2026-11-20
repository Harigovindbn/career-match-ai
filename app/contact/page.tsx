import type { Metadata } from "next";
import Link from "next/link";

import InfoPage from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Contact" };

const REPO_URL = "https://github.com/Harigovindbn/career-match-ai";

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Contact Us"
      intro={<p>Questions, feedback or found a bug? We&apos;d love to hear from you.</p>}
      sections={[
        {
          heading: "Report an issue or request a feature",
          body: (
            <p>
              Open an issue on the project&apos;s{" "}
              <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#99f6e4] hover:underline">
                GitHub repository
              </a>
              . Please include the page you were on and the steps to reproduce the problem.
            </p>
          ),
        },
        {
          heading: "Account help",
          body: (
            <p>
              Forgot your password? Use the{" "}
              <Link href="/auth/reset-password" className="font-semibold text-[#99f6e4] hover:underline">
                password reset page
              </Link>
              . You can update your name, email and password any time from Settings after signing in.
            </p>
          ),
        },
      ]}
    />
  );
}
