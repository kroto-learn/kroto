import type { Course } from "./Course";
import type { Event } from "./Event";

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
  courses: Course[];
  events: Event[];
};
