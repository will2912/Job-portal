import { createContext, useContext, useEffect, useState } from "react";

// Default state
const initialState = {
  theme: "system",
  setTheme: () => {},
};

// Create context
const ThemeProviderContext = createContext(initialState);

// Provider component
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(storageKey) || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const appliedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    root.classList.add(appliedTheme);
    localStorage.setItem(storageKey, theme); // Sync to localStorage
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context || typeof context.setTheme !== "function") {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
