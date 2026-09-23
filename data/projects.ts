// --- PROJECT MODEL (OOP) ---

export type ProjectRank = "S" | "A" | "B";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectProps {
  title: string;
  year: number;
  role: string;
  description: string;
  contribution?: string;
  tags: string[];
  links: ProjectLink[];
  rank?: ProjectRank;
}

export class Project {
  readonly title: string;
  readonly year: number;
  readonly role: string;
  readonly description: string;
  readonly tags: string[];
  readonly links: ProjectLink[];
  readonly rank: ProjectRank;

  constructor(props: ProjectProps) {
    this.title = props.title;
    this.year = props.year;
    this.role = props.role;
    this.description = props.description;
    this.tags = props.tags;
    this.links = props.links;
    this.rank = props.rank ?? "B";
  }

  get rankColorClass(): string {
    switch (this.rank) {
      case "S":
        return "bg-[#f72585]/20 text-[#f72585]";
      case "A":
        return "bg-[#4cc9f0]/20 text-[#4cc9f0]";
      default:
        return "bg-[#ffd60a]/20 text-[#ffd60a]";
    }
  }

  get rankLabel(): string {
    return `${this.rank}-Rank`;
  }

  get primaryLink(): ProjectLink | undefined {
    return this.links[0];
  }
}

export const projects: Project[] = [
  new Project({
    title: "LEKAN",
    year: 2026,
    role: "Backend Developer",
    rank: "S",
    description:
      "A digital fish auction marketplace platform connecting fishermen with buyers, built as a Semester 4 Software Engineering project at BINUS. The monorepo architecture combines a Next.js 15 frontend with a Node.js/Express backend, supported by Supabase for database, authentication, file storage, and real-time updates.",
    tags: ["Next.js", "Node.js", "Express", "Supabase"],
    links: [
      { label: "Live App", url: "https://lekan-one.vercel.app/" },
      { label: "GitHub", url: "https://github.com/Quaaltagh/lekan-public" },
    ],
  }),
  new Project({
    title: "Lone Brawl",
    year: 2026,
    role: "Developer",
    rank: "A",
    description:
      "Tank Battle Arena — a fast-paced top-down shooter game where players control a tank and survive increasingly difficult and numerous enemy waves. Contributions focused on battle map design, obstacle placement, enemy spawning, and strategic pathing.",
    tags: ["Unity", "C#", "Game Design"],
    links: [
      { label: "Play / Rate", url: "https://itch.io/jam/log-in-2026/rate/4581456" },
      { label: "GitHub", url: "https://github.com/KrapuRED/Lone-Brawl" },
    ],
  }),
  new Project({
    title: "VeriReview AI",
    year: 2026,
    role: "Developer",
    rank: "A",
    description:
      "An explainable e-commerce fake review detection system, utilizing a fine-tuned BERT model to classify reviews as genuine or fake in real-time, complete with confidence scoring and highlighting of suspicious phrases. Achieved 90.81% accuracy and a 91.34% F1-score with a React + FastAPI architecture.",
    tags: ["Python", "BERT", "FastAPI", "React"],
    links: [{ label: "Colab Notebook", url: "https://colab.research.google.com/drive/1OC0GBJWsuMFRr1AWwDuZZa-O3p3jn2Iu?usp=sharing" }],
  }),
  new Project({
    title: "JAAEL",
    year: 2025,
    role: "Developer",
    rank: "B",
    description:
      "A microservices-based air quality prediction system that forecasts pollution risk levels using a hybrid approach of rule-based scoring and a Random Forest Classifier. Built as the sole developer, covering the backend API, ML microservice (~82% accuracy), and frontend visualization.",
    tags: ["Node.js", "FastAPI", "Random Forest", "Vite"],
    links: [{ label: "GitHub", url: "https://github.com/Quaaltagh/AOL_AI_JAEEL" }],
  }),
  new Project({
    title: "Bullet Haven",
    year: 2026,
    role: "Developer",
    rank: "B",
    description:
      "A 2D top-down shooter survival game built in Unity, developed solo under LOGIC (BINUS Game Development Organization). Covers player shooting mechanics, enemy AI, wave spawning systems, and the core gameplay loop from scratch.",
    tags: ["Unity", "C#", "Game Dev"],
    links: [{ label: "GitHub", url: "https://github.com/Quaaltagh/2D-game" }],
  }),
];