import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { getInitialTheme, setTheme } from "@utils/theme";

// Sun/moon toggle. Reflects the current theme and persists the user's choice.
const ThemeToggle = () => {
  const [theme, setThemeState] = useState(() => getInitialTheme());

  // Keep <html> in sync if state ever changes outside setTheme (defensive).
  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const toggle = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "עבור למצב בהיר" : "עבור למצב כהה"}
      title={isDark ? "מצב בהיר" : "מצב כהה"}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-black/10
                 text-slate-700 hover:bg-slate-100 transition-colors
                 dark:text-yellow-300 dark:border-white/15 dark:hover:bg-slate-700"
    >
      {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
