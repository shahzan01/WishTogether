import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../atoms/themeAtom";

const ThemeInitializer: React.FC = () => {
  const theme = useRecoilValue(themeAtom);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme);
    } else {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return null;
};

export default ThemeInitializer;
