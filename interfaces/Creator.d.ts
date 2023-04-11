type Link = {
  href: string;
  type: "youtube" | "twitter" | "linkedin" | "instagram" | "website" | "other";
};

export type Creator = {
  id: string;
  cover_art_url: string;
  name: string;
  image_url: string;
  bio: string;
  links: Link[];
  topmate_url: string;
};
