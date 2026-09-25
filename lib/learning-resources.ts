export type LearningResource = {
  title: string;
  type: "Documentation" | "Practice" | "Course";
  url: string;
};

const RESOURCE_MAP: Record<
  string,
  LearningResource[]
> = {
  Python: [
    {
      title: "Python Official Documentation",
      type: "Documentation",
      url: "https://docs.python.org/3/",
    },
    {
      title: "Python Practice",
      type: "Practice",
      url: "https://www.hackerrank.com/domains/python",
    },
  ],

  "Machine Learning": [
    {
      title: "Scikit-learn User Guide",
      type: "Documentation",
      url: "https://scikit-learn.org/stable/user_guide.html",
    },
    {
      title: "Machine Learning Practice",
      type: "Practice",
      url: "https://www.kaggle.com/learn",
    },
  ],

  "Deep Learning": [
    {
      title: "PyTorch Tutorials",
      type: "Documentation",
      url: "https://docs.pytorch.org/tutorials/",
    },
    {
      title: "TensorFlow Tutorials",
      type: "Documentation",
      url: "https://www.tensorflow.org/tutorials",
    },
  ],

  PyTorch: [
    {
      title: "PyTorch Tutorials",
      type: "Documentation",
      url: "https://docs.pytorch.org/tutorials/",
    },
    {
      title: "PyTorch Practice",
      type: "Practice",
      url: "https://pytorch.org/tutorials/",
    },
  ],

  TensorFlow: [
    {
      title: "TensorFlow Tutorials",
      type: "Documentation",
      url: "https://www.tensorflow.org/tutorials",
    },
    {
      title: "TensorFlow Learn",
      type: "Course",
      url: "https://www.tensorflow.org/learn",
    },
  ],

  NumPy: [
    {
      title: "NumPy Documentation",
      type: "Documentation",
      url: "https://numpy.org/doc/",
    },
  ],

  Pandas: [
    {
      title: "Pandas Documentation",
      type: "Documentation",
      url: "https://pandas.pydata.org/docs/",
    },
  ],

  "scikit-learn": [
    {
      title: "Scikit-learn Documentation",
      type: "Documentation",
      url: "https://scikit-learn.org/stable/",
    },
  ],

  SQL: [
    {
      title: "SQLBolt",
      type: "Practice",
      url: "https://sqlbolt.com/",
    },
    {
      title: "PostgreSQL Documentation",
      type: "Documentation",
      url: "https://www.postgresql.org/docs/",
    },
  ],

  Docker: [
    {
      title: "Docker Documentation",
      type: "Documentation",
      url: "https://docs.docker.com/",
    },
    {
      title: "Docker Get Started",
      type: "Course",
      url: "https://docs.docker.com/get-started/",
    },
  ],

  FastAPI: [
    {
      title: "FastAPI Documentation",
      type: "Documentation",
      url: "https://fastapi.tiangolo.com/",
    },
  ],

  "REST API": [
    {
      title: "MDN HTTP Overview",
      type: "Documentation",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
    },
  ],

  AWS: [
    {
      title: "AWS Documentation",
      type: "Documentation",
      url: "https://docs.aws.amazon.com/",
    },
    {
      title: "AWS Skill Builder",
      type: "Course",
      url: "https://skillbuilder.aws/",
    },
  ],

  MLOps: [
    {
      title: "MLflow Documentation",
      type: "Documentation",
      url: "https://mlflow.org/docs/latest/ml/",
    },
    {
      title: "Kubeflow Documentation",
      type: "Documentation",
      url: "https://www.kubeflow.org/docs/",
    },
  ],

  JavaScript: [
    {
      title: "MDN JavaScript Guide",
      type: "Documentation",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    },
  ],

  TypeScript: [
    {
      title: "TypeScript Documentation",
      type: "Documentation",
      url: "https://www.typescriptlang.org/docs/",
    },
  ],

  React: [
    {
      title: "React Documentation",
      type: "Documentation",
      url: "https://react.dev/learn",
    },
  ],

  "Node.js": [
    {
      title: "Node.js Documentation",
      type: "Documentation",
      url: "https://nodejs.org/docs/latest/api/",
    },
  ],

  "Express.js": [
    {
      title: "Express.js Documentation",
      type: "Documentation",
      url: "https://expressjs.com/",
    },
  ],

  MongoDB: [
    {
      title: "MongoDB Documentation",
      type: "Documentation",
      url: "https://www.mongodb.com/docs/",
    },
  ],

  Git: [
    {
      title: "Git Documentation",
      type: "Documentation",
      url: "https://git-scm.com/doc",
    },
    {
      title: "Git Practice",
      type: "Practice",
      url: "https://learngitbranching.js.org/",
    },
  ],

  Kubernetes: [
    {
      title: "Kubernetes Documentation",
      type: "Documentation",
      url: "https://kubernetes.io/docs/home/",
    },
  ],

  "Model Deployment": [
    {
      title: "FastAPI Documentation",
      type: "Documentation",
      url: "https://fastapi.tiangolo.com/",
    },
    {
      title: "Docker Documentation",
      type: "Documentation",
      url: "https://docs.docker.com/",
    },
  ],

  "Power BI": [
    {
      title: "Microsoft Power BI Learning",
      type: "Course",
      url: "https://learn.microsoft.com/power-bi/",
    },
  ],
};

export function getLearningResources(
  skillName: string
): LearningResource[] {
  return (
    RESOURCE_MAP[skillName] || [
      {
        title: `${skillName} Documentation`,
        type: "Documentation",
        url: `https://www.google.com/search?q=${encodeURIComponent(
          skillName + " official documentation"
        )}`,
      },
    ]
  );
}