import capitalise from "./capitalise";

const COMPONENTS_TO_REMOVE = [
  "https://",
  ".io",
  ".com",
  "kovan",
  "goerli",
  "/",
  ".",
];

const destructureBlockExplorer = (url?: string) => {
  if (!url) return "Block Explorer";

  COMPONENTS_TO_REMOVE.forEach((toRemove) => {
    url = (url as string).replace(toRemove, "");
  });

  return capitalise(url);
};

export default destructureBlockExplorer;
