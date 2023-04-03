import { type Creator } from "interfaces/Creator";

export const getCreatorsClient = async () => {
  const data = await fetch("/data.json");
  return ((await data.json()) as { creators: Creator[] })?.creators;
};
