export const themeIds = ["dinosaur", "dragon"] as const;

export type ThemeId = (typeof themeIds)[number];

export type Theme = {
  id: ThemeId;
  name: string;
  player: string;
  cheer: string;
  denHeadline: string;
  cardLine: string;
  body: string;
  belly: string;
  spot: string;
  accent: string;
  cheek: string;
};

export const themes: Record<ThemeId, Theme> = {
  dinosaur: {
    id: "dinosaur",
    name: "Dinosaur",
    player: "a dinosaur",
    cheer: "Stomp!",
    denHeadline: "Ready to stomp?",
    cardLine: "Roars, stomps, and dinosaur pals.",
    body: "#5aaa3a",
    belly: "#f3e2a2",
    spot: "#3e8f32",
    accent: "#e07a2f",
    cheek: "#f0a07a",
  },
  dragon: {
    id: "dragon",
    name: "Dragon",
    player: "a dragon",
    cheer: "Spark!",
    denHeadline: "Ready to soar?",
    cardLine: "Wings, sparks, and little dragons.",
    body: "#8d4eb8",
    belly: "#f6d98a",
    spot: "#c9a6e8",
    accent: "#e2b43a",
    cheek: "#f2a0c4",
  },
};

export function isThemeId(value: unknown): value is ThemeId {
  return value === "dinosaur" || value === "dragon";
}

export function otherTheme(theme: ThemeId): ThemeId {
  return theme === "dinosaur" ? "dragon" : "dinosaur";
}
