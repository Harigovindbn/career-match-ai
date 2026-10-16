import Link from "next/link";
import { Sparkles, Mail, ShieldCheck, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#21252d] bg-[#090a0f] text-[#8e95a2]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-bold text-white transition hover:opacity-90"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#99f6e4] text-[#042f2e]">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span>
                CareerMatch<span className="text-[#99f6e4]">AI</span>
              </span>
            </Link>
            <p className="text-xs text-[#8e95a2]">
              © {new Date().getFullYear()} CareerMatch AI. All rights reserved.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <Link
              href="/privacy"
              className="flex items-center gap-1.5 transition hover:text-[#99f6e4]"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#99f6e4]" />
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="flex items-center gap-1.5 transition hover:text-[#99f6e4]"
            >
              <FileText className="h-3.5 w-3.5 text-[#99f6e4]" />
              Terms of Service
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-1.5 transition hover:text-[#99f6e4]"
            >
              <Mail className="h-3.5 w-3.5 text-[#99f6e4]" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}