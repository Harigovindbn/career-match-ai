import Link from "next/link";
import { Sparkles, Upload, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export default function AutoResumeSection() {
  return (
    <section className="border-t border-[#21252d] bg-[#090a0f] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#21252d] bg-[#121417] p-8 sm:p-12 shadow-2xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#21252d] bg-[#181b20] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#99f6e4]">
                <Sparkles className="h-3.5 w-3.5" />
                Automated Scanner
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Analyse your uploaded resume <span className="text-[#99f6e4]">automatically</span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#8e95a2]">
                Our AI instantly parses your experience, evaluates formatting for ATS compatibility, and highlights missing keywords against target job descriptions.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-[#8e95a2]">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#99f6e4] shrink-0" />
                  <span>Instant ATS compatibility score</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#99f6e4] shrink-0" />
                  <span>Detailed breakdown of missing keywords</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#99f6e4] shrink-0" />
                  <span>Actionable recommendations to stand out</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/ats-score"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-6 py-3.5 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/10"
                >
                  Upload Resume
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Dropzone Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#21252d] bg-[#181b20] p-8 text-center transition hover:border-[#99f6e4]/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#99f6e4] text-[#042f2e] shadow-sm">
                <Upload className="h-7 w-7 stroke-[2.2]" />
              </div>

              <p className="mt-5 font-semibold text-white">
                Drag & drop your resume here
              </p>

              <p className="mt-2 text-xs text-[#8e95a2]">
                Supports PDF, DOCX, or TXT up to 10MB
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#21252d] bg-[#121417] px-4 py-2 text-xs text-[#8e95a2]">
                <FileText className="h-4 w-4 text-[#99f6e4]" />
                <span>sample_resume.pdf</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}