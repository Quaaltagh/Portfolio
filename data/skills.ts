export class Skill {
  constructor(
    public readonly name: string,
    public readonly matchTags: string[]
  ) {}
}

export const skills: Skill[] = [
  new Skill("Frontend / React / Next.js", ["React", "Next.js"]),
  new Skill("Backend / Node.js / SQL", ["Node.js", "Express", "Supabase", "FastAPI"]),
  new Skill("Game Dev / Unity", ["Unity", "C#"]),
  new Skill("AI / Python", ["Python", "BERT", "Random Forest", "Scikit-learn", "K-Means"]),
];

export class Technology {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly color: string
  ) {}

  get iconUrl(): string {
    return `https://cdn.simpleicons.org/${this.slug}/${this.color}`;
  }
}

export const cloudTechnologies: Technology[] = [
  new Technology("React", "react", "61DAFB"),
  new Technology("TypeScript", "typescript", "3178C6"),
  new Technology("Next.js", "nextdotjs", "FFFFFF"),
  new Technology("Tailwind", "tailwindcss", "38BDF8"),
  new Technology("Node.js", "nodedotjs", "5FA04E"),
  new Technology("Python", "python", "3776AB"),
  new Technology("SQL", "postgresql", "4169E1"),
  new Technology("OpenCV", "opencv", "5C3EE8"),
  new Technology("Java", "openjdk", "FFFFFF"),
  new Technology("Framer", "framer", "0055FF"),
  new Technology("Git", "git", "F05032"),
  new Technology("Unity", "unity", "FFFFFF"),
  new Technology("C#", "csharp", "9B4F96"),
  new Technology(".NET", "dotnet", "512BD4"),
];