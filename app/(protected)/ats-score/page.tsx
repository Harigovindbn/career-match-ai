import AtsScoreWorkspace from "@/components/ats/AtsScoreWorkspace";
import { getLatestResume } from "@/lib/resume/get-latest-resume";

export default async function ATSScorePage() {
  const { resume, error } = await getLatestResume();

  return <AtsScoreWorkspace resume={resume} resumeError={error} />;
}
