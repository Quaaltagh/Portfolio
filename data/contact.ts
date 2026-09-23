export class ContactInfo {
  constructor(
    public readonly email: string,
    public readonly phone: string,
    public readonly linkedin: string,
    public readonly github: string
  ) {}

  get mailtoLink(): string {
    return `mailto:${this.email}`;
  }
}

export const contact = new ContactInfo(
  "joh.hendrawan@gmail.com",
  "+62 896-3792-8534",
  "https://linkedin.com/in/johan-hendrawan-6838a1326",
  "https://github.com/Quaaltagh"
);
