export type SkillImportance = "High" | "Medium" | "Low";

export type RequiredSkill = {
  name: string;
  importance: SkillImportance;
};

export type JobRole = {
  name: string;
  description: string;
  skills: RequiredSkill[];
};

export const JOB_ROLES: JobRole[] = [
  {
    name: "AI/ML Engineer",
    description: "Build and deploy machine learning systems.",
    skills: [
      { name: "Python", importance: "High" },
      { name: "Machine Learning", importance: "High" },
      { name: "Deep Learning", importance: "High" },
      { name: "PyTorch", importance: "High" },
      { name: "TensorFlow", importance: "Medium" },
      { name: "NumPy", importance: "High" },
      { name: "Pandas", importance: "High" },
      { name: "scikit-learn", importance: "High" },
      { name: "SQL", importance: "Medium" },
      { name: "Docker", importance: "Medium" },
      { name: "Git", importance: "High" },
      { name: "FastAPI", importance: "Medium" },
      { name: "AWS", importance: "Medium" },
      { name: "MLOps", importance: "Medium" },
      { name: "REST API", importance: "Medium" },
    ],
  },

  {
    name: "Data Scientist",
    description: "Analyze data and build predictive models.",
    skills: [
      { name: "Python", importance: "High" },
      { name: "Machine Learning", importance: "High" },
      { name: "Statistics", importance: "High" },
      { name: "Pandas", importance: "High" },
      { name: "NumPy", importance: "High" },
      { name: "scikit-learn", importance: "High" },
      { name: "SQL", importance: "High" },
      { name: "Data Visualization", importance: "Medium" },
      { name: "Matplotlib", importance: "Medium" },
      { name: "Git", importance: "Medium" },
    ],
  },

  {
    name: "Backend Developer",
    description: "Build server-side applications and APIs.",
    skills: [
      { name: "JavaScript", importance: "High" },
      { name: "Node.js", importance: "High" },
      { name: "Express.js", importance: "High" },
      { name: "SQL", importance: "High" },
      { name: "MongoDB", importance: "Medium" },
      { name: "REST API", importance: "High" },
      { name: "Git", importance: "High" },
      { name: "Docker", importance: "Medium" },
      { name: "Redis", importance: "Medium" },
      { name: "AWS", importance: "Medium" },
    ],
  },

  {
    name: "Frontend Developer",
    description: "Build modern web interfaces.",
    skills: [
      { name: "HTML", importance: "High" },
      { name: "CSS", importance: "High" },
      { name: "JavaScript", importance: "High" },
      { name: "React", importance: "High" },
      { name: "Next.js", importance: "Medium" },
      { name: "TypeScript", importance: "Medium" },
      { name: "Git", importance: "High" },
      { name: "REST API", importance: "Medium" },
    ],
  },

  {
    name: "Data Analyst",
    description: "Analyze data and create business reports.",
    skills: [
      { name: "SQL", importance: "High" },
      { name: "Python", importance: "Medium" },
      { name: "Pandas", importance: "High" },
      { name: "NumPy", importance: "Medium" },
      { name: "Power BI", importance: "High" },
      { name: "Excel", importance: "High" },
      { name: "Data Visualization", importance: "High" },
      { name: "Statistics", importance: "Medium" },
    ],
  },

  {
    name: "Full Stack Developer",
    description: "Work across frontend and backend systems.",
    skills: [
      { name: "HTML", importance: "High" },
      { name: "CSS", importance: "High" },
      { name: "JavaScript", importance: "High" },
      { name: "React", importance: "High" },
      { name: "Node.js", importance: "High" },
      { name: "Express.js", importance: "High" },
      { name: "MongoDB", importance: "Medium" },
      { name: "SQL", importance: "Medium" },
      { name: "REST API", importance: "High" },
      { name: "Git", importance: "High" },
      { name: "Docker", importance: "Medium" },
    ],
  },
];

export function getJobRole(roleName: string): JobRole | null {
  return (
    JOB_ROLES.find(
      (role) =>
        role.name.toLowerCase() === roleName.toLowerCase()
    ) ?? null
  );
}