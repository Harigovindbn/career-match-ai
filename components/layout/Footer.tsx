export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <p>
          © {new Date().getFullYear()} CareerMatch AI. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a href="#" className="transition hover:text-white">
            Privacy
          </a>

          <a href="#" className="transition hover:text-white">
            Terms
          </a>

          <a href="#" className="transition hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}