type SkillDefinition = {
  name: string;
  patterns: string[];
};

const SKILL_DEFINITIONS: SkillDefinition[] = [
  {
    name: "Python",
    patterns: ["python"],
  },
  {
    name: "JavaScript",
    patterns: ["javascript", "js"],
  },
  {
    name: "TypeScript",
    patterns: ["typescript", "ts"],
  },
  {
    name: "Java",
    patterns: ["java"],
  },
  {
    name: "C++",
    patterns: ["c++", "cpp"],
  },
  {
    name: "C",
    patterns: ["c programming", " c "],
  },
  {
    name: "HTML",
    patterns: ["html"],
  },
  {
    name: "CSS",
    patterns: ["css"],
  },
  {
    name: "React",
    patterns: ["react", "react.js", "reactjs"],
  },
  {
    name: "Next.js",
    patterns: ["next.js", "nextjs"],
  },
  {
    name: "Node.js",
    patterns: ["node.js", "nodejs"],
  },
  {
    name: "Express.js",
    patterns: ["express.js", "expressjs"],
  },
  {
    name: "FastAPI",
    patterns: ["fastapi", "fast api"],
  },
  {
    name: "Spring Boot",
    patterns: ["spring boot"],
  },
  {
    name: "MongoDB",
    patterns: ["mongodb", "mongo db"],
  },
  {
    name: "MySQL",
    patterns: ["mysql"],
  },
  {
    name: "PostgreSQL",
    patterns: ["postgresql", "postgres"],
  },
  {
    name: "SQL",
    patterns: ["sql"],
  },
  {
    name: "NoSQL",
    patterns: ["nosql", "no sql"],
  },
  {
    name: "Git",
    patterns: ["git"],
  },
  {
    name: "GitHub",
    patterns: ["github", "git hub"],
  },
  {
    name: "Docker",
    patterns: ["docker"],
  },
  {
    name: "Kubernetes",
    patterns: ["kubernetes", "k8s"],
  },
  {
    name: "AWS",
    patterns: ["aws", "amazon web services"],
  },
  {
    name: "Azure",
    patterns: ["azure"],
  },
  {
    name: "Google Cloud",
    patterns: ["google cloud", "gcp"],
  },
  {
    name: "Redis",
    patterns: ["redis"],
  },
  {
    name: "Machine Learning",
    patterns: ["machine learning", "machine-learning"],
  },
  {
    name: "Deep Learning",
    patterns: ["deep learning", "deep-learning"],
  },
  {
    name: "Natural Language Processing",
    patterns: ["natural language processing", "nlp"],
  },
  {
    name: "TensorFlow",
    patterns: ["tensorflow", "tensor flow"],
  },
  {
    name: "PyTorch",
    patterns: ["pytorch", "torch"],
  },
  {
    name: "scikit-learn",
    patterns: ["scikit-learn", "scikit learn", "sklearn"],
  },
  {
    name: "Pandas",
    patterns: ["pandas"],
  },
  {
    name: "NumPy",
    patterns: ["numpy", "num py"],
  },
  {
    name: "Power BI",
    patterns: ["power bi"],
  },
  {
    name: "Tableau",
    patterns: ["tableau"],
  },
  {
    name: "REST API",
    patterns: ["rest api", "restful api", "restful apis"],
  },
  {
    name: "Data Structures",
    patterns: ["data structures", "data structure"],
  },
  {
    name: "Algorithms",
    patterns: ["algorithms", "algorithm"],
  },
  {
    name: "System Design",
    patterns: ["system design"],
  },
  {
    name: "MLOps",
    patterns: ["mlops", "ml ops"],
  },
  {
    name: "Model Deployment",
    patterns: ["model deployment", "model serving"],
  },
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsSkill(text: string, pattern: string): boolean {
  const escaped = escapeRegex(pattern.trim());

  const regex = new RegExp(
    `(^|[^a-zA-Z0-9+#.])${escaped}([^a-zA-Z0-9+#.]|$)`,
    "i"
  );

  return regex.test(text);
}

export function extractSkills(text: string): string[] {
  if (!text || !text.trim()) {
    return [];
  }

  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ");

  const detectedSkills = new Set<string>();

  for (const skill of SKILL_DEFINITIONS) {
    for (const pattern of skill.patterns) {
      if (containsSkill(normalizedText, pattern)) {
        detectedSkills.add(skill.name);
        break;
      }
    }
  }

  return Array.from(detectedSkills).sort((a, b) =>
    a.localeCompare(b)
  );
}