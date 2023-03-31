import type { CourseEvent } from "./CourseEvent";

type Link = {
  href: string;
  type: "youtube" | "twitter" | "linkedin" | "instagram" | "website" | "other";
  text?: string;
};

export type Creator = {
  id: string;
  cover_art_url: string;
  name: string;
  image_url: string;
  bio: string;
  links: Link[];
  courses: CourseEvent[];
  events: CourseEvent[];
};
