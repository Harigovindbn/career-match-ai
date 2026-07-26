import {
  BriefcaseBusiness,
  Code2,
  Globe2,
  Link2,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

type ProfileFormProps = {
  profile: {
    full_name: string | null;
    phone: string | null;
    location: string | null;
    professional_title: string | null;
    bio: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
  };
  action: (formData: FormData) => void | Promise<void>;
  saved?: boolean;
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/30 focus:bg-white/15 focus:ring-4 focus:ring-white/5";

const labelClassName =
  "mb-2 flex items-center gap-2 text-sm font-semibold text-white";

export default function ProfileForm({
  profile,
  action,
}: ProfileFormProps) {
  return (
    <form action={action} className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-card-dark p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Personal information
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Basic details
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Add the information employers and recruiters need to understand
              your professional background.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <UserRound className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="full_name" className={labelClassName}>
              <UserRound className="h-4 w-4 text-white/60" />
              Full name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={profile.full_name ?? ""}
              placeholder="Enter your full name"
              autoComplete="name"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="professional_title" className={labelClassName}>
              <BriefcaseBusiness className="h-4 w-4 text-white/60" />
              Professional title
            </label>

            <input
              id="professional_title"
              name="professional_title"
              type="text"
              defaultValue={profile.professional_title ?? ""}
              placeholder="Frontend Developer"
              autoComplete="organization-title"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClassName}>
              <Phone className="h-4 w-4 text-white/60" />
              Phone number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone ?? ""}
              placeholder="+60 12 345 6789"
              autoComplete="tel"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="location" className={labelClassName}>
              <MapPin className="h-4 w-4 text-white/60" />
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              defaultValue={profile.location ?? ""}
              placeholder="Kuala Lumpur, Malaysia"
              autoComplete="address-level2"
              className={inputClassName}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-card-dark p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Professional summary
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Tell your story
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Write a clear introduction about your experience, strengths, and
              career goals.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-7">
          <label htmlFor="bio" className={labelClassName}>
            <BriefcaseBusiness className="h-4 w-4 text-white/60" />
            Professional bio
          </label>

          <textarea
            id="bio"
            name="bio"
            rows={7}
            defaultValue={profile.bio ?? ""}
            placeholder="Write a short professional introduction..."
            className={`${inputClassName} resize-none leading-7`}
          />

          <p className="mt-3 text-xs leading-5 text-white/45">
            A strong bio usually includes your role, core skills, experience,
            and the opportunities you are looking for.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-card-dark p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Online presence
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Professional links
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Connect your professional profiles so employers can review your
              work and experience.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Globe2 className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-3">
          <div>
            <label htmlFor="linkedin_url" className={labelClassName}>
              <Link2 className="h-4 w-4 text-white/60" />
              LinkedIn URL
            </label>

            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              defaultValue={profile.linkedin_url ?? ""}
              placeholder="https://linkedin.com/in/username"
              autoComplete="url"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="github_url" className={labelClassName}>
              <Code2 className="h-4 w-4 text-white/60" />
              GitHub URL
            </label>

            <input
              id="github_url"
              name="github_url"
              type="url"
              defaultValue={profile.github_url ?? ""}
              placeholder="https://github.com/username"
              autoComplete="url"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="portfolio_url" className={labelClassName}>
              <Globe2 className="h-4 w-4 text-white/60" />
              Portfolio URL
            </label>

            <input
              id="portfolio_url"
              name="portfolio_url"
              type="url"
              defaultValue={profile.portfolio_url ?? ""}
              placeholder="https://yourportfolio.com"
              autoComplete="url"
              className={inputClassName}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-semibold text-foreground">
            Ready to save your changes?
          </p>

          <p className="mt-1 text-sm text-muted">
            Your profile information will be used to improve future career
            recommendations.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-dark px-6 py-3 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
        >
          <Save className="h-4 w-4" />
          Save profile
        </button>
      </section>
    </form>
  );
}