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

export default function ProfileForm({
  profile,
  action,
  saved = false,
}: ProfileFormProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {saved && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Profile updated successfully.
        </div>
      )}

      <form action={action} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="full_name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={profile.full_name ?? ""}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="professional_title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Professional Title
            </label>

            <input
              id="professional_title"
              name="professional_title"
              type="text"
              defaultValue={profile.professional_title ?? ""}
              placeholder="Frontend Developer"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone ?? ""}
              placeholder="+60 12 345 6789"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              defaultValue={profile.location ?? ""}
              placeholder="Kuala Lumpur, Malaysia"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Professional Bio
          </label>

          <textarea
            id="bio"
            name="bio"
            rows={5}
            defaultValue={profile.bio ?? ""}
            placeholder="Write a short professional introduction..."
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="linkedin_url"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              LinkedIn URL
            </label>

            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              defaultValue={profile.linkedin_url ?? ""}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="github_url"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              GitHub URL
            </label>

            <input
              id="github_url"
              name="github_url"
              type="url"
              defaultValue={profile.github_url ?? ""}
              placeholder="https://github.com/username"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="portfolio_url"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Portfolio URL
            </label>

            <input
              id="portfolio_url"
              name="portfolio_url"
              type="url"
              defaultValue={profile.portfolio_url ?? ""}
              placeholder="https://yourportfolio.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 pt-6">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}