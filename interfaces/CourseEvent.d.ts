export type CourseEvent = {
  title: string;
  description?: string;
  thumbnail?: string;
  featured?: boolean;
  datetime: string;
  duration: number;
  id: string;
  eventType: "virtual" | "in_person";
  eventUrl: string;
  eventLocation: string;
};
