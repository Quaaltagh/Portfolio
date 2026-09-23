export class Skill {
  constructor(
    public readonly name: string,
    public readonly value: number
  ) {}
}

export const skills: Skill[] = [
  new Skill("Frontend / React / Next.js", 90),
  new Skill("Backend / Node.js / SQL", 85),
  new Skill("Game Dev / Unity", 75),
  new Skill("AI / Python", 90),
];

export const cloudTechnologies: string[] = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind",
  "Node.js",
  "Python",
  "SQL",
  "OpenCV",
  "Java",
  "Framer",
  "Git",
  "Unity",
  "C#",
];
