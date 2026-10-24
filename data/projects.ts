// --- PROJECT MODEL (OOP) ---

export type ProjectRank = "S" | "A" | "B";
export type ProjectCategory = "fullstack" | "ai" | "game" | "mobile";

export const categories: { id: ProjectCategory; label: string }[] = [
  { id: "fullstack", label: "Fullstack & Web" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "game", label: "Game Dev" },
  { id: "mobile", label: "Mobile"},
];

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectProps {
  title: string;
  year: number;
  role: string;
  category: ProjectCategory;
  description: string;
  contribution?: string;
  tags: string[];
  links: ProjectLink[];
  rank?: ProjectRank;
  image?: string;
  images?: string[];
}

export class Project {
  readonly title: string;
  readonly year: number;
  readonly role: string;
  readonly category: ProjectCategory;
  readonly description: string;
  readonly tags: string[];
  readonly links: ProjectLink[];
  readonly rank: ProjectRank;
  readonly image?: string;
  readonly images: string[];

  constructor(props: ProjectProps) {
    this.title = props.title;
    this.year = props.year;
    this.role = props.role;
    this.category = props.category;
    this.description = props.description;
    this.tags = props.tags;
    this.links = props.links;
    this.rank = props.rank ?? "B";
    this.image = props.image;
    this.images = props.images ?? [];
  }

  get gallery(): string[] {
    const all = [this.image, ...this.images].filter((src): src is string => Boolean(src));
    return Array.from(new Set(all));
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

  get categoryLabel(): string {
    return categories.find((c) => c.id === this.category)?.label ?? "";
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
    category: "fullstack",
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
    image: "/PictureQuest/Lekan/1.png",
    images: ["/PictureQuest/Lekan/1.png", "/PictureQuest/Lekan/2.png", "/PictureQuest/Lekan/3.png", "/PictureQuest/Lekan/4.png", "/PictureQuest/Lekan/5.png"],
  }),

  new Project({
    title: "VeriReview AI",
    year: 2026,
    role: "AI Engineer",
    category: "ai",
    description:
      `VeriReview AI is an explainable fake review detection system for e-commerce that uses a fine-tuned BERT model to classify product
      reviews as real or fake in real time, complete with confidence scoring and suspicious phrase highlighting, built on a React + FastAPI full
      stack architecture achieving 90.81% accuracy and 91.34% F1-score. My Contribution, I was responsible for building and training the BERT
      based classification model, handling the full ML pipeline from data preprocessing and tokenization to fine-tuning, evaluation, and
      exporting the final model for team use.`,
    tags: ["Python", "BERT"],
    links: [{ label: "Colab Notebook", url: "https://colab.research.google.com/drive/1OC0GBJWsuMFRr1AWwDuZZa-O3p3jn2Iu?usp=sharing" }],
    image: "/PictureQuest/VeriReview/1.png",
  }),

  new Project({
    title: "EcoPulse",
    year: 2026,
    role: "Machine Learning Engineer",
    category: "ai",
    description:
      `EcoPulse is a Streamlit web app that clusters 176 countries by energy sustainability indicators using a K-Means model (k=2), built as a
      Semester 4 Machine Learning project at BINUS University. Countries are grouped based on the 3-year average of 5 energy indicators —
      separating nations with high modern energy access/consumption from those with limited access and consumption still dominated by
      traditional biomass. The pipeline includes median imputation, IQR clipping, log1p transformation for skewed features, and RobustScaler,
      with k selected via Silhouette Score across k=2–10. K-Means (Silhouette 0.4657) outperformed Hierarchical/Ward clustering, while DBSCAN
      was used only for anomaly detection since over 90% of countries were flagged as noise. The app has 3 pages: predicting a new country's
      cluster with a radar chart, exploring cluster profiles via an interactive t-SNE map, and an about-the-model page with methodology and
      algorithm comparison.`,
    tags: ["Python", "Streamlit", "K-Means", "Scikit-learn"],
    links: [
      { label: "Live App", url: "https://ecopulse-jqzo6qhu3eqnoacrt6iybf.streamlit.app/" },
      { label: "GitHub", url: "https://github.com/Quaaltagh/EcoPulse" },
    ],
    image: "/PictureQuest/Ecopulse/1.png",
  }),

  new Project({
    title: "Lone Brawl",
    year: 2026,
    role: "Developer",
    category: "game",
    description:
      `Tank Battle Arena is a fast-paced, top-down shooter game where players control a tank and must survive against relentless waves of enemy
      tanks that spawn progressively faster and in greater numbers, earning points for every enemy destroyed — with my contribution focused
      on designing the battle map, including obstacle placement, spawn enmy and strategic pathways that shape how every fight unfolds`,
    tags: ["Unity", "C#", "Game Design"],
    links: [
      { label: "Play / Rate", url: "https://itch.io/jam/log-in-2026/rate/4581456" },
      { label: "GitHub", url: "https://github.com/KrapuRED/Lone-Brawl" },
    ],
    image: "/PictureQuest/LoneBrawl/1.png",
  }),

  new Project({
    title: "VNS",
    year: 2026,
    role: "Fullstack Developer",
    category: "fullstack",
    description: `VNS is a premium perfume e-commerce landing page designed to showcase an exclusive eau de parfum collection, featuring five signature scents: Mandarin, Black Cherry, Orange Blossom, Vanilla, and Amber.
    Built with a modern frontend approach using React, JSX, and Vite, the project focuses on delivering a visually appealing, responsive, and user-friendly shopping experience that communicates the brand's exclusivity and premium fragrance identity.`,
    tags: ["JSX", "Vite", "React"],
    links: [
      { label: "GitHub", url: "https://github.com/berubob/venture-creation-binus" },
      { label: "Live App", url: "https://venture-creation-project-binus.vercel.app/" },
    ],
    image: "/PictureQuest/VNS/1.png",
    images: ["/PictureQuest/VNS/1.png", "/PictureQuest/VNS/2.png"],
  }),

  new Project({
    title: "JAAEL",
    year: 2025,
    role: "Fullstack Developer",
    category: "fullstack",
    description: `The Air Quality Prediction System is a microservices-based web application that predicts air pollution risk levels using a hybrid approach combining rule-based scoring and a Random Forest Classifier ML model, built with a Node.js/Express backend, Python/FastAPI ML microservice, and a Vite frontend — designed with fallback logic to remain functional even when the ML service is unavailable. 
    My Contribution: As the sole developer, I built the entire system end-to-end, including the backend API with validation and fallback logic, the ML microservice with a trained Random Forest Classifier (~82% accuracy), the frontend for input and visualization, and the full microservices integration between all components.`,
    tags: ["Node.js", "FastAPI", "Random Forest", "Vite", "React"],
    links: [
      { label: "GitHub", url: "https://github.com/Quaaltagh/AOL_AI_JAEEL" },
      { label: "Demo Video", url: "https://drive.google.com/file/d/1yMkLFCTTv9EWbKId__4S0-aU9WBu9X93/view?usp=sharing" },
    ],
    image: "/PictureQuest/JAAEL/1.png",
    images: ["/PictureQuest/JAAEL/1.png", "/PictureQuest/JAAEL/2.png", "/PictureQuest/JAAEL/3.png", "/PictureQuest/JAAEL/4.png", "/PictureQuest/JAAEL/5.png"],
  }),

  new Project({
    title: "Bullet Haven",
    year: 2026,
    role: "Developer",
    category: "game",
    description:
      "Bullet Haven is a 2D top-down shooter survival game built in Unity where players must fend off endless waves of enemies using shooting mechanics, with increasing difficulty designed to test reflexes and strategic movement. My Contribution, as a solo developer under LOGIC (BINUS Game Development Organization), I independently designed and built the entire game, including player shooting mechanics, enemy AI and wave spawning system, and overall gameplay loop from scratch using Unity, with UI assets sourced from the Unity Asset Store",
    tags: ["Unity", "C#", "Game Dev"],
    links: [{ label: "GitHub", url: "https://github.com/Quaaltagh/2D-game" }],
    image: "/PictureQuest/BulletHaven/1.png",
  }),
  
  new Project({
    title: "Monivue",
    year: 2026,
    role: "Mobile Developer",
    category: "mobile",
    description:
      "Monivue is an offline-first personal finance tracking app for Android, built with Flutter and fully localized in Bahasa Indonesia. It lets users record income, expenses, and transfers across multiple accounts, organize them with custom categories, and review their finances through a dashboard, searchable transaction history, statistics charts, and budgets. Key features include recurring transactions with automatic generation, transaction templates, PIN and biometric app lock, and encrypted local backup and restore. My Contribution, as a solo developer, I independently designed and built the entire app, including the layered architecture (data, domain, presentation), the Drift/SQLite database schema and migrations, Riverpod state management, the fintech-style UI with light and dark themes, and the security and backup systems from scratch using Flutter.",
    tags: ["Flutter", "Dart", "Riverpod", "Drift", "SQLite"],
    links: [
      { label: "GitHub", url: "https://github.com/Quaaltagh/monivue" },
    ],
    image: "/PictureQuest/Monivue/1.png",
    images: ["/PictureQuest/Monivue/1.png", "/PictureQuest/Monivue/2.png", "/PictureQuest/Monivue/3.png", "/PictureQuest/Monivue/4.png", "/PictureQuest/Monivue/5.png", "/PictureQuest/Monivue/6.png", "/PictureQuest/Monivue/7.png", "/PictureQuest/Monivue/8.png"],
  }),
];