"use server";

export async function searchJobsAction(formData: FormData) {
  const roleQuery = formData.get("roleQuery") as string || "Full Stack Engineer";
  const locationQuery = formData.get("locationQuery") as string || "Remote";

  // Simulate API fetch delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock live market matching results
  const mockJobs = [
    {
      id: "1",
      title: `Senior ${roleQuery}`,
      company: "Vercel Ecosystem",
      location: locationQuery,
      salary: "$140k - $175k",
      matchScore: 96,
      tags: ["React", "Next.js", "TypeScript", "Tailwind"],
      posted: "2 hours ago",
    },
    {
      id: "2",
      title: `Lead Frontend Architect`,
      company: "Stripe Scale",
      location: locationQuery,
      salary: "$160k - $210k",
      matchScore: 89,
      tags: ["TypeScript", "GraphQL", "Performance", "React"],
      posted: "Yesterday",
    },
    {
      id: "3",
      title: `Full Stack Engineer`,
      company: "Linear Workflow",
      location: locationQuery,
      salary: "$130k - $160k",
      matchScore: 84,
      tags: ["Node.js", "PostgreSQL", "React", "Tailwind"],
      posted: "3 days ago",
    },
    {
      id: "4",
      title: `Software Engineer, Core Systems`,
      company: "Supabase Labs",
      location: locationQuery,
      salary: "$145k - $180k",
      matchScore: 78,
      tags: ["TypeScript", "Docker", "AWS", "SQL"],
      posted: "5 days ago",
    },
  ];

  return { success: true, jobs: mockJobs };
}