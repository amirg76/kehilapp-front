// Dark-mode helpers. The theme is applied by toggling the `dark` class on
// <html> (Tailwind darkMode:'class'). The user's explicit choice is persisted
// in localStorage under 'theme'; with no stored choice we fall back to the OS
// preference (prefers-color-scheme) on first load.
const STORAGE_KEY = "theme";

export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY); // 'dark' | 'light' | null
  } catch {
    return null;
  }
}

export function getInitialTheme() {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") return stored;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function setTheme(theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore storage failures (private mode, blocked cookies) */
  }
}
