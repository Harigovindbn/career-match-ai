import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          CareerMatch<span className="text-blue-500">AI</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-slate-300 transition hover:text-white">
            Home
          </Link>

          <Link
            href="#features"
            className="text-slate-300 transition hover:text-white"
          >
            Features
          </Link>

          <Link
            href="#pricing"
            className="text-slate-300 transition hover:text-white"
          >
            Pricing
          </Link>

          <Link
            href="/auth/login"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
          >
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
}