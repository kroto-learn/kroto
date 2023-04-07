export type CourseEvent = {
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  featured?: boolean;
  datetime: string;
  duration: number;
  creator: string;
  ogdescription: string;
  id: string;
  event_type: "virtual" | "in_person";
  event_url: string;
  event_location: string;
};
