export type Event = {
  title: string;
  description:
    | "youtube"
    | "twitter"
    | "linkedin"
    | "instagram"
    | "website"
    | "other";
  thumbnail: string;
  price: number;
  featured?: boolean;
  datetime: string;
};
