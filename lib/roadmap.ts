export type RoadmapSkill = {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  topics: string[];
  project: string;
};

const ROADMAP_SKILLS: Record<string, RoadmapSkill> = {
  Python: {
    name: "Python",
    level: "Beginner",
    duration: "2 weeks",
    topics: [
      "Python fundamentals",
      "Functions and modules",
      "Object-oriented programming",
      "File handling",
      "Exception handling",
    ],
    project: "Build a Python CLI application",
  },

  "Machine Learning": {
    name: "Machine Learning",
    level: "Intermediate",
    duration: "4 weeks",
    topics: [
      "Supervised learning",
      "Unsupervised learning",
      "Regression",
      "Classification",
      "Clustering",
      "Model evaluation",
    ],
    project: "Build an end-to-end ML prediction system",
  },

  "Deep Learning": {
    name: "Deep Learning",
    level: "Advanced",
    duration: "4 weeks",
    topics: [
      "Neural networks",
      "Backpropagation",
      "CNN",
      "RNN",
      "Transfer learning",
      "Model optimization",
    ],
    project: "Build an image classification system",
  },

  PyTorch: {
    name: "PyTorch",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "Tensors",
      "Datasets and DataLoaders",
      "Neural networks",
      "Training loops",
      "Model evaluation",
    ],
    project: "Train and deploy a PyTorch model",
  },

  TensorFlow: {
    name: "TensorFlow",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "TensorFlow basics",
      "Keras",
      "Model creation",
      "Training",
      "Evaluation",
      "Model saving",
    ],
    project: "Build a TensorFlow classification model",
  },

  NumPy: {
    name: "NumPy",
    level: "Beginner",
    duration: "1 week",
    topics: [
      "Arrays",
      "Indexing",
      "Broadcasting",
      "Vectorization",
      "Linear algebra",
    ],
    project: "Implement data-processing operations with NumPy",
  },

  Pandas: {
    name: "Pandas",
    level: "Beginner",
    duration: "1 week",
    topics: [
      "Series and DataFrames",
      "Data cleaning",
      "Filtering",
      "Grouping",
      "Merging",
      "Data analysis",
    ],
    project: "Analyze a real-world dataset",
  },

  "scikit-learn": {
    name: "scikit-learn",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "Preprocessing",
      "Pipelines",
      "Classification",
      "Regression",
      "Clustering",
      "Model evaluation",
    ],
    project: "Build a complete machine learning pipeline",
  },

  SQL: {
    name: "SQL",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "SELECT queries",
      "Joins",
      "Subqueries",
      "Aggregations",
      "Indexes",
      "Window functions",
    ],
    project: "Build an analytics database project",
  },

  Docker: {
    name: "Docker",
    level: "Intermediate",
    duration: "1 week",
    topics: [
      "Images",
      "Containers",
      "Dockerfile",
      "Docker Compose",
      "Volumes",
      "Networking",
    ],
    project: "Containerize a machine learning or web application",
  },

  FastAPI: {
    name: "FastAPI",
    level: "Intermediate",
    duration: "1 week",
    topics: [
      "API fundamentals",
      "Routes",
      "Request validation",
      "Pydantic",
      "Authentication",
      "Deployment",
    ],
    project: "Build an ML prediction REST API",
  },

  "REST API": {
    name: "REST API",
    level: "Intermediate",
    duration: "1 week",
    topics: [
      "HTTP methods",
      "Request and response",
      "Status codes",
      "Authentication",
      "CRUD",
      "API design",
    ],
    project: "Build a complete REST API",
  },

  AWS: {
    name: "AWS",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "EC2",
      "S3",
      "IAM",
      "Lambda",
      "Cloud deployment",
      "Basic monitoring",
    ],
    project: "Deploy an application on AWS",
  },

  MLOps: {
    name: "MLOps",
    level: "Advanced",
    duration: "3 weeks",
    topics: [
      "ML pipelines",
      "Experiment tracking",
      "Model versioning",
      "CI/CD",
      "Monitoring",
      "Model lifecycle",
    ],
    project: "Build an automated ML deployment pipeline",
  },

  JavaScript: {
    name: "JavaScript",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "ES6+",
      "Functions",
      "Promises",
      "Async/await",
      "DOM",
      "API calls",
    ],
    project: "Build an interactive web application",
  },

  TypeScript: {
    name: "TypeScript",
    level: "Intermediate",
    duration: "1 week",
    topics: [
      "Types",
      "Interfaces",
      "Generics",
      "Functions",
      "Classes",
      "Type-safe APIs",
    ],
    project: "Convert a JavaScript project to TypeScript",
  },

  React: {
    name: "React",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "Components",
      "Props",
      "State",
      "Hooks",
      "Forms",
      "API integration",
    ],
    project: "Build a production-style React dashboard",
  },

  "Node.js": {
    name: "Node.js",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "Node fundamentals",
      "Modules",
      "Express",
      "Middleware",
      "Authentication",
      "API development",
    ],
    project: "Build a backend service",
  },

  "Express.js": {
    name: "Express.js",
    level: "Intermediate",
    duration: "1 week",
    topics: [
      "Routing",
      "Middleware",
      "Controllers",
      "Error handling",
      "Authentication",
      "REST APIs",
    ],
    project: "Build a production-style Express API",
  },

  MongoDB: {
    name: "MongoDB",
    level: "Intermediate",
    duration: "1 week",
    topics: [
      "Collections",
      "Documents",
      "Queries",
      "Indexes",
      "Aggregation",
      "Mongoose",
    ],
    project: "Build a MongoDB-backed application",
  },

  Git: {
    name: "Git",
    level: "Beginner",
    duration: "3 days",
    topics: [
      "Repositories",
      "Branches",
      "Commits",
      "Merge",
      "Rebase",
      "Pull requests",
    ],
    project: "Manage a complete project with Git",
  },

  Kubernetes: {
    name: "Kubernetes",
    level: "Advanced",
    duration: "2 weeks",
    topics: [
      "Pods",
      "Deployments",
      "Services",
      "ConfigMaps",
      "Secrets",
      "Scaling",
    ],
    project: "Deploy a containerized application on Kubernetes",
  },

  "Model Deployment": {
    name: "Model Deployment",
    level: "Advanced",
    duration: "2 weeks",
    topics: [
      "Model serialization",
      "Inference APIs",
      "Docker deployment",
      "Cloud deployment",
      "Monitoring",
      "Scaling",
    ],
    project: "Deploy an ML model as a production API",
  },

  PowerBI: {
    name: "Power BI",
    level: "Intermediate",
    duration: "2 weeks",
    topics: [
      "Data import",
      "Data cleaning",
      "Data modeling",
      "DAX",
      "Charts",
      "Dashboards",
    ],
    project: "Build an interactive business dashboard",
  },


};

export function getRoadmapSkill(
  skillName: string
): RoadmapSkill {
  const exact = ROADMAP_SKILLS[skillName];

  if (exact) {
    return exact;
  }

  return {
    name: skillName,
    level: "Intermediate",
    duration: "1 week",
    topics: [
      `Learn ${skillName} fundamentals`,
      `Practice ${skillName}`,
      `Build with ${skillName}`,
      `Apply ${skillName} in a project`,
    ],
    project: `Build a practical project using ${skillName}`,
  };
}