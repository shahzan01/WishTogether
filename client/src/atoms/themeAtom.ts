import { atom } from "recoil";

export type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme");
  return (savedTheme as Theme) || "light";
};

export const themeAtom = atom<Theme>({
  key: "theme",
  default: getInitialTheme(),
});
