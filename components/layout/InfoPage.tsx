import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export type InfoSection = { heading: string; body: React.ReactNode };

export default function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  sections: InfoSection[];
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#090a0f] px-6 py-16 text-white lg:px-8">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <div className="mt-4 text-sm leading-7 text-[#8e95a2]">{intro}</div>

          <div className="mt-10 space-y-6">
            {sections.map((section) => (
              <section
                key={section.heading}
                className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 sm:p-8"
              >
                <h2 className="text-lg font-semibold">{section.heading}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[#8e95a2]">{section.body}</div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
