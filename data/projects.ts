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
  image?: string;
}

export class Project {
  readonly title: string;
  readonly year: number;
  readonly role: string;
  readonly description: string;
  readonly tags: string[];
  readonly links: ProjectLink[];
  readonly rank: ProjectRank;
  readonly image?: string;

  constructor(props: ProjectProps) {
    this.title = props.title;
    this.year = props.year;
    this.role = props.role;
    this.description = props.description;
    this.tags = props.tags;
    this.links = props.links;
    this.rank = props.rank ?? "B";
    this.image = props.image;
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
    role: "Fullstack Developer",
    // rank: "S",
    description:
      `LEKAN is a digital seafood auction marketplace platform that connects fishermen with buyers, built as a Semester 4 Software Engineering
      project at BINUS University. The platform features a monorepo architecture combining a Next.js (v15) frontend with a Node.js/Express.js
      backend, powered by Supabase for database, authentication, file storage, and real-time updates. Key features include live auction
      browsing with countdown timers, bid submission, fisherman dashboard with auction management, an integrated wallet system with
      deposit/withdrawal functionality, and an automated auction expiry job — all designed to digitize and streamline the traditional fish trading
      process. My contributions to the LEKAN project included developing the backend auction system — handling API endpoints, auction expiry
      cron job, and bid logic — along with minor frontend fixes, setting up and configuring the Supabase database schema, and deploying the full
      application to production`,
    tags: ["Next.js", "Node.js", "Express", "Supabase"],
    links: [
      { label: "Live App", url: "https://lekan-one.vercel.app/" },
      { label: "GitHub", url: "https://github.com/Quaaltagh/lekan-public" },
    ],
    image: "/PictureQuest/Lekan.png",
  }),
  new Project({
    title: "VeriReview AI",
    year: 2026,
    role: "Developer",
    // rank: "A",
    description:
      `VeriReview AI is an explainable fake review detection system for e-commerce that uses a fine-tuned BERT model to classify product
      reviews as real or fake in real time, complete with confidence scoring and suspicious phrase highlighting, built on a React + FastAPI full
      stack architecture achieving 90.81% accuracy and 91.34% F1-score. My Contribution, I was responsible for building and training the BERT
      based classification model, handling the full ML pipeline from data preprocessing and tokenization to fine-tuning, evaluation, and
      exporting the final model for team use.`,
    tags: ["Python", "BERT", "FastAPI", "React"],
    links: [{ label: "Colab Notebook", url: "https://colab.research.google.com/drive/1OC0GBJWsuMFRr1AWwDuZZa-O3p3jn2Iu?usp=sharing" }],
    image: "/PictureQuest/VeriReview.png",
  }),
  new Project({
    title: "Lone Brawl",
    year: 2026,
    role: "Developer",
    // rank: "A",
    description:
      `Tank Battle Arena is a fast-paced, top-down shooter game where players control a tank and must survive against relentless waves of enemy
      tanks that spawn progressively faster and in greater numbers, earning points for every enemy destroyed — with my contribution focused
      on designing the battle map, including obstacle placement, spawn enmy and strategic pathways that shape how every fight unfolds`,
    tags: ["Unity", "C#", "Game Design"],
    links: [
      { label: "Play / Rate", url: "https://itch.io/jam/log-in-2026/rate/4581456" },
      { label: "GitHub", url: "https://github.com/KrapuRED/Lone-Brawl" },
    ],
    image: "/PictureQuest/LoneBrawl.png",
  }),
  new Project({
    title: "JAAEL",
    year: 2025,
    role: "Developer",
    // rank: "B",
    description: `The Air Quality Prediction System is a microservices-based web application that predicts air pollution risk levels using a hybrid approach combining rule-based scoring and a Random Forest Classifier ML model, built with a Node.js/Express backend, Python/FastAPI ML microservice, and a Vite frontend — designed with fallback logic to remain functional even when the ML service is unavailable. 
    My Contribution: As the sole developer, I built the entire system end-to-end, including the backend API with validation and fallback logic, the ML microservice with a trained Random Forest Classifier (~82% accuracy), the frontend for input and visualization, and the full microservices integration between all components.`,
    tags: ["Node.js", "FastAPI", "Random Forest", "Vite"],
    links: [{ label: "GitHub", url: "https://github.com/Quaaltagh/AOL_AI_JAEEL" }],
    image: "/PictureQuest/JAAEL.png",
  }),
  new Project({
    title: "Bullet Haven",
    year: 2026,
    role: "Developer",
    // rank: "B",
    description:
      "Bullet Haven is a 2D top-down shooter survival game built in Unity where players must fend off endless waves of enemies using shooting mechanics, with increasing difficulty designed to test reflexes and strategic movement. My Contribution, as a solo developer under LOGIC (BINUS Game Development Organization), I independently designed and built the entire game, including player shooting mechanics, enemy AI and wave spawning system, and overall gameplay loop from scratch using Unity, with UI assets sourced from the Unity Asset Store",
    tags: ["Unity", "C#", "Game Dev"],
    links: [{ label: "GitHub", url: "https://github.com/Quaaltagh/2D-game" }],
    image: "/PictureQuest/BulletHaven.png",
  }),
];