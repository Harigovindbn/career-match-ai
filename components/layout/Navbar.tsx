export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-white">
          CareerMatch<span className="text-blue-500">AI</span>
        </h1>

        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-300 hover:text-white">
            Home
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Features
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Pricing
          </a>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
            Sign In
          </button>
        </div>
      </nav>
    </header>
  );
}