type ContactDetails = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
};

type EducationItem = {
  qualification: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  details: string;
};

type ExperienceItem = {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
};

type ProjectItem = {
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
};

type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
};

export type ResumeAnalysis = {
  atsScore: number;
  contact: ContactDetails;
  summary: string;
  skills: string[];
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
};

const SKILL_DICTIONARY = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "C",
  "C++",
  "C#",
  "PHP",
  "R",
  "Kotlin",
  "Swift",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "React",
  "Next.js",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "Laravel",
  "Spring Boot",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "SQL Server",
  "Oracle",
  "MongoDB",
  "Firebase",
  "Supabase",
  "Git",
  "GitHub",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Linux",
  "Figma",
  "UI Design",
  "Graphic Design",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Canva",
  "Power BI",
  "Tableau",
  "Excel",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "Data Analysis",
  "Data Science",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "OpenCV",
  "Selenium",
  "Selenium IDE",
  "WebDriver",
  "TestNG",
  "Jira",
  "Bugzilla",
  "Manual Testing",
  "Automation Testing",
  "Black Box Testing",
  "Functional Testing",
  "Regression Testing",
  "Unit Testing",
  "API Testing",
  "Postman",
  "REST API",
  "JDBC",
  "JSP",
  "Servlets",
  "SDLC",
  "STLC",
  "Agile",
  "Scrum",
];

const ACTION_VERBS = [
  "achieved",
  "analysed",
  "automated",
  "built",
  "collaborated",
  "created",
  "designed",
  "developed",
  "implemented",
  "improved",
  "increased",
  "led",
  "managed",
  "optimized",
  "reduced",
  "resolved",
  "tested",
  "trained",
];

const SECTION_PATTERNS = {
  summary:
    /\b(career objective|professional summary|profile|objective|summary)\b/i,

  education:
    /\b(education|academic qualification|academic background|qualification)\b/i,

  skills:
    /\b(technical skills|skills profile|skills|technologies|competencies)\b/i,

  experience:
    /\b(work experience|professional experience|employment history|internship|experience)\b/i,

  projects:
    /\b(academic project|projects|project experience|personal projects)\b/i,

  certifications:
    /\b(certifications|certificates|courses|training)\b/i,
};

function normalizeText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function extractEmail(text: string): string {
  const match = text.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  );

  return match?.[0] ?? "";
}

function extractPhone(text: string): string {
  const matches = text.match(
    /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g,
  );

  if (!matches) {
    return "";
  }

  const phone = matches.find((value) => {
    const digits = value.replace(/\D/g, "");

    return digits.length >= 8 && digits.length <= 15;
  });

  return phone?.trim() ?? "";
}

function extractLinkedIn(text: string): string {
  const match = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s,)]+/i,
  );

  return match?.[0] ?? "";
}

function extractPortfolio(text: string): string {
  const urlMatches =
    text.match(
      /(?:https?:\/\/|www\.)[^\s,)]+/gi,
    ) ?? [];

  const portfolio = urlMatches.find(
    (url) =>
      !url.toLowerCase().includes("linkedin.com") &&
      !url.toLowerCase().includes("@"),
  );

  return portfolio ?? "";
}

function looksLikeName(line: string): boolean {
  const cleaned = line
    .replace(/^name\s*:\s*/i, "")
    .trim();

  if (!cleaned || cleaned.length < 3 || cleaned.length > 60) {
    return false;
  }

  if (
    /resume|curriculum|email|phone|mobile|address|objective/i.test(
      cleaned,
    )
  ) {
    return false;
  }

  const words = cleaned.split(/\s+/);

  return (
    words.length >= 2 &&
    words.length <= 5 &&
    words.every((word) =>
      /^[A-Za-z.'-]+$/.test(word),
    )
  );
}

function extractName(text: string): string {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 15);

  const labelledName = lines.find((line) =>
    /^name\s*:/i.test(line),
  );

  if (labelledName) {
    return labelledName
      .replace(/^name\s*:\s*/i, "")
      .trim();
  }

  return lines.find(looksLikeName) ?? "";
}

function extractLocation(text: string): string {
  const labelledLocation = text.match(
    /(?:location|address|contact address|permanent address)\s*:\s*([^\n]+)/i,
  );

  return labelledLocation?.[1]?.trim() ?? "";
}

function extractContact(text: string): ContactDetails {
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    linkedin: extractLinkedIn(text),
    portfolio: extractPortfolio(text),
  };
}

function extractSkills(text: string): string[] {
  const detectedSkills = SKILL_DICTIONARY.filter(
    (skill) => {
      const escapedSkill =
        escapeRegularExpression(skill);

      const pattern = new RegExp(
        `(^|[^a-z0-9])${escapedSkill}([^a-z0-9]|$)`,
        "i",
      );

      return pattern.test(text);
    },
  );

  return uniqueStrings(detectedSkills);
}

function findSectionContent(
  text: string,
  headingPattern: RegExp,
): string {
  const lines = text.split("\n");

  const startIndex = lines.findIndex((line) =>
    headingPattern.test(line.trim()),
  );

  if (startIndex === -1) {
    return "";
  }

  const allHeadingPatterns = Object.values(
    SECTION_PATTERNS,
  );

  const sectionLines: string[] = [];

  for (
    let index = startIndex + 1;
    index < lines.length;
    index += 1
  ) {
    const line = lines[index].trim();

    if (
      sectionLines.length > 0 &&
      allHeadingPatterns.some((pattern) =>
        pattern.test(line),
      )
    ) {
      break;
    }

    if (line) {
      sectionLines.push(line);
    }

    if (sectionLines.length >= 20) {
      break;
    }
  }

  return sectionLines.join("\n").trim();
}

function extractEducation(
  text: string,
): EducationItem[] {
  const educationText = findSectionContent(
    text,
    SECTION_PATTERNS.education,
  );

  if (!educationText) {
    return [];
  }

  const educationLines = educationText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) =>
      /\b(bachelor|master|b\.?tech|m\.?tech|bca|mca|bsc|msc|diploma|degree|university|college|school|10th|12th|cgpa|percentage)\b/i.test(
        line,
      ),
    )
    .slice(0, 8);

  if (educationLines.length === 0) {
    return [];
  }

  return [
    {
      qualification: educationLines[0] ?? "",
      institution:
        educationLines.find((line) =>
          /\b(university|college|school|institute)\b/i.test(
            line,
          ),
        ) ?? "",
      location: "",
      startDate: "",
      endDate: "",
      grade:
        educationLines.find((line) =>
          /\b(\d+(?:\.\d+)?%|cgpa|gpa)\b/i.test(line),
        ) ?? "",
      details: educationLines.join(" | "),
    },
  ];
}

function extractExperience(
  text: string,
): ExperienceItem[] {
  const experienceText = findSectionContent(
    text,
    SECTION_PATTERNS.experience,
  );

  if (!experienceText) {
    return [];
  }

  const lines = experienceText
    .split("\n")
    .map((line) =>
      line
        .replace(/^[•▪●\-–—*]+\s*/, "")
        .trim(),
    )
    .filter(Boolean)
    .slice(0, 12);

  if (lines.length === 0) {
    return [];
  }

  return [
    {
      jobTitle: lines[0] ?? "",
      company:
        lines.find((line) =>
          /\b(company|technologies|solutions|limited|ltd|inc|corporation)\b/i.test(
            line,
          ),
        ) ?? "",
      location: "",
      startDate: "",
      endDate: "",
      responsibilities: lines.slice(1),
    },
  ];
}

function extractProjects(
  text: string,
  skills: string[],
): ProjectItem[] {
  const projectText = findSectionContent(
    text,
    SECTION_PATTERNS.projects,
  );

  if (!projectText) {
    return [];
  }

  const lines = projectText
    .split("\n")
    .map((line) =>
      line
        .replace(/^[•▪●\-–—*]+\s*/, "")
        .trim(),
    )
    .filter(Boolean)
    .slice(0, 15);

  if (lines.length === 0) {
    return [];
  }

  const projectNameLine =
    lines.find((line) =>
      /project\s*name\s*:/i.test(line),
    ) ?? lines[0];

  const descriptionLine =
    lines.find((line) =>
      /description\s*:/i.test(line),
    ) ?? lines.slice(1).join(" ");

  return [
    {
      name: projectNameLine
        .replace(/project\s*name\s*:/i, "")
        .trim(),
      description: descriptionLine
        .replace(/description\s*:/i, "")
        .trim(),
      technologies: skills.filter((skill) =>
        projectText
          .toLowerCase()
          .includes(skill.toLowerCase()),
      ),
      highlights: lines
        .filter((line) =>
          /\b(role|duration|developed|built|created|implemented|designed|improved)\b/i.test(
            line,
          ),
        )
        .slice(0, 6),
    },
  ];
}

function extractCertifications(
  text: string,
): CertificationItem[] {
  const certificationText = findSectionContent(
    text,
    SECTION_PATTERNS.certifications,
  );

  if (!certificationText) {
    return [];
  }

  const lines = certificationText
    .split("\n")
    .map((line) =>
      line
        .replace(/^[•▪●\-–—*]+\s*/, "")
        .trim(),
    )
    .filter(Boolean)
    .filter((line) =>
      /\b(certified|certification|certificate|course|training|academy|institute)\b/i.test(
        line,
      ),
    )
    .slice(0, 8);

  return lines.map((line) => ({
    name: line,
    issuer: "",
    date: "",
  }));
}

function countMeasurableAchievements(
  text: string,
): number {
  const matches = text.match(
    /\b\d+(?:\.\d+)?(?:%|\+|x|hours?|days?|months?|years?|users?|projects?|tests?|cases?|members?)\b/gi,
  );

  return matches?.length ?? 0;
}

function countActionVerbs(text: string): number {
  const lowercaseText = text.toLowerCase();

  return ACTION_VERBS.filter((verb) =>
    new RegExp(`\\b${verb}\\b`, "i").test(
      lowercaseText,
    ),
  ).length;
}

function calculateAtsScore(input: {
  text: string;
  contact: ContactDetails;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}): number {
  let score = 0;

  if (input.contact.name) score += 5;
  if (input.contact.email) score += 5;
  if (input.contact.phone) score += 5;

  if (input.contact.location) score += 2;
  if (input.contact.linkedin) score += 3;

  if (SECTION_PATTERNS.summary.test(input.text)) {
    score += 5;
  }

  if (input.education.length > 0) {
    score += 15;
  }

  if (input.skills.length >= 10) {
    score += 20;
  } else if (input.skills.length >= 5) {
    score += 15;
  } else if (input.skills.length > 0) {
    score += 8;
  }

  if (input.experience.length > 0) {
    score += 15;
  } else if (
    /\b(internship|training|worked|experience)\b/i.test(
      input.text,
    )
  ) {
    score += 8;
  }

  if (input.projects.length > 0) {
    score += 10;
  }

  if (input.certifications.length > 0) {
    score += 5;
  }

  const wordCount = input.text.split(/\s+/).length;

  if (wordCount >= 250 && wordCount <= 1200) {
    score += 5;
  } else if (wordCount >= 150) {
    score += 3;
  }

  if (countActionVerbs(input.text) >= 3) {
    score += 3;
  }

  if (countMeasurableAchievements(input.text) >= 2) {
    score += 2;
  }

  return Math.min(100, Math.max(0, score));
}

function buildStrengths(input: {
  contact: ContactDetails;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  text: string;
}): string[] {
  const strengths: string[] = [];

  if (
    input.contact.name &&
    input.contact.email &&
    input.contact.phone
  ) {
    strengths.push(
      "The resume contains the main contact details required by recruiters.",
    );
  }

  if (input.skills.length >= 8) {
    strengths.push(
      "The resume demonstrates a broad range of technical and professional skills.",
    );
  } else if (input.skills.length > 0) {
    strengths.push(
      "The resume includes identifiable technical skills.",
    );
  }

  if (input.education.length > 0) {
    strengths.push(
      "Education details are included and visible.",
    );
  }

  if (input.experience.length > 0) {
    strengths.push(
      "Work experience or internship information is present.",
    );
  }

  if (input.projects.length > 0) {
    strengths.push(
      "The resume includes a project section that demonstrates practical work.",
    );
  }

  if (countActionVerbs(input.text) >= 3) {
    strengths.push(
      "The resume uses action-oriented language.",
    );
  }

  if (
    countMeasurableAchievements(input.text) >= 2
  ) {
    strengths.push(
      "The resume contains measurable details that improve credibility.",
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "The resume contains readable information that can be improved further.",
    );
  }

  return strengths;
}

function buildImprovements(input: {
  contact: ContactDetails;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  text: string;
}): string[] {
  const improvements: string[] = [];

  if (!input.contact.linkedin) {
    improvements.push(
      "Add a LinkedIn profile link.",
    );
  }

  if (!input.contact.location) {
    improvements.push(
      "Add a city and country to the contact section.",
    );
  }

  if (!SECTION_PATTERNS.summary.test(input.text)) {
    improvements.push(
      "Add a concise professional summary or career objective.",
    );
  }

  if (input.skills.length < 8) {
    improvements.push(
      "Add more job-relevant technical skills and tools.",
    );
  }

  if (input.experience.length === 0) {
    improvements.push(
      "Add internship, training, freelance, volunteer, or work experience.",
    );
  }

  if (input.projects.length === 0) {
    improvements.push(
      "Add academic or personal projects with technologies and outcomes.",
    );
  }

  if (input.certifications.length === 0) {
    improvements.push(
      "Add relevant certifications or completed professional courses.",
    );
  }

  if (
    countMeasurableAchievements(input.text) < 2
  ) {
    improvements.push(
      "Add measurable achievements using numbers, percentages, users, projects, or time saved.",
    );
  }

  if (countActionVerbs(input.text) < 3) {
    improvements.push(
      "Start bullet points with strong action verbs such as developed, implemented, designed, or improved.",
    );
  }

  return improvements;
}

function buildMissingKeywords(
  skills: string[],
  text: string,
): string[] {
  const missingKeywords: string[] = [];

  const hasProgramming =
    skills.some((skill) =>
      [
        "Python",
        "Java",
        "JavaScript",
        "TypeScript",
        "C",
        "C++",
        "C#",
        "PHP",
      ].includes(skill),
    );

  const hasDatabase = skills.some((skill) =>
    [
      "SQL",
      "MySQL",
      "PostgreSQL",
      "SQL Server",
      "Oracle",
      "MongoDB",
    ].includes(skill),
  );

  if (hasProgramming && !hasDatabase) {
    missingKeywords.push(
      "Database management",
      "SQL",
    );
  }

  if (
    /testing|selenium|testng|bugzilla|jira/i.test(
      text,
    )
  ) {
    const testingKeywords = [
      "API Testing",
      "Postman",
      "Regression Testing",
      "Agile",
      "Test Case Design",
      "Defect Tracking",
    ];

    for (const keyword of testingKeywords) {
      if (
        !text
          .toLowerCase()
          .includes(keyword.toLowerCase())
      ) {
        missingKeywords.push(keyword);
      }
    }
  }

  if (
    /developer|frontend|front-end|web development/i.test(
      text,
    )
  ) {
    const webKeywords = [
      "Responsive Design",
      "REST API",
      "Git",
      "GitHub",
      "Deployment",
    ];

    for (const keyword of webKeywords) {
      if (
        !text
          .toLowerCase()
          .includes(keyword.toLowerCase())
      ) {
        missingKeywords.push(keyword);
      }
    }
  }

  if (
    !/\b(teamwork|communication|problem solving|leadership)\b/i.test(
      text,
    )
  ) {
    missingKeywords.push(
      "Communication",
      "Teamwork",
      "Problem Solving",
    );
  }

  return uniqueStrings(missingKeywords).slice(
    0,
    12,
  );
}

function buildSummary(input: {
  contact: ContactDetails;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
}): string {
  const candidateName =
    input.contact.name || "The candidate";

  const mainSkills = input.skills
    .slice(0, 6)
    .join(", ");

  const statements: string[] = [];

  if (mainSkills) {
    statements.push(
      `${candidateName} demonstrates skills in ${mainSkills}.`,
    );
  } else {
    statements.push(
      `${candidateName} has submitted a readable resume for ATS evaluation.`,
    );
  }

  if (input.education.length > 0) {
    statements.push(
      "The resume includes education information.",
    );
  }

  if (input.experience.length > 0) {
    statements.push(
      "It also contains experience or internship details.",
    );
  } else if (input.projects.length > 0) {
    statements.push(
      "Practical ability is demonstrated through project work.",
    );
  }

  return statements.join(" ");
}

export async function analyseResume(
  extractedText: string,
): Promise<ResumeAnalysis> {
  const text = normalizeText(extractedText);

  if (!text) {
    throw new Error(
      "The extracted resume text is empty.",
    );
  }

  const contact = extractContact(text);
  const skills = extractSkills(text);
  const education = extractEducation(text);
  const experience = extractExperience(text);
  const projects = extractProjects(text, skills);
  const certifications =
    extractCertifications(text);

  const atsScore = calculateAtsScore({
    text,
    contact,
    skills,
    education,
    experience,
    projects,
    certifications,
  });

  const strengths = buildStrengths({
    text,
    contact,
    skills,
    education,
    experience,
    projects,
    certifications,
  });

  const improvements = buildImprovements({
    text,
    contact,
    skills,
    education,
    experience,
    projects,
    certifications,
  });

  const missingKeywords = buildMissingKeywords(
    skills,
    text,
  );

  const summary = buildSummary({
    contact,
    skills,
    education,
    experience,
    projects,
  });

  return {
    atsScore,
    contact,
    summary,
    skills,
    strengths,
    improvements,
    missingKeywords,
    education,
    experience,
    projects,
    certifications,
  };
}