"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme   = "dark" | "light" | "system";
type FontSize = "compact" | "default" | "large";
type Density  = "cozy" | "comfortable";

interface ThemeContextValue {
  theme:     Theme;
  fontSize:  FontSize;
  density:   Density;
  setTheme:    (t: Theme)    => void;
  setFontSize: (f: FontSize) => void;
  setDensity:  (d: Density)  => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light", fontSize: "default", density: "comfortable",
  setTheme: () => {}, setFontSize: () => {}, setDensity: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme,    setThemeState]    = useState<Theme>("light");
  const [fontSize, setFontSizeState] = useState<FontSize>("default");
  const [density,  setDensityState]  = useState<Density>("comfortable");

  // Apply to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme",    theme);
    html.setAttribute("data-fontsize", fontSize);
    html.setAttribute("data-density",  density);
  }, [theme, fontSize, density]);

  // Persist
  useEffect(() => {
    const saved = localStorage.getItem("noteable-theme-prefs");
    if (saved) {
      const { theme, fontSize, density } = JSON.parse(saved);
      if (theme)    setThemeState(theme);
      if (fontSize) setFontSizeState(fontSize);
      if (density)  setDensityState(density);
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    persist({ theme: t, fontSize, density });
  };
  const setFontSize = (f: FontSize) => {
    setFontSizeState(f);
    persist({ theme, fontSize: f, density });
  };
  const setDensity = (d: Density) => {
    setDensityState(d);
    persist({ theme, fontSize, density: d });
  };

  const persist = (prefs: object) =>
    localStorage.setItem("noteable-theme-prefs", JSON.stringify(prefs));

  return (
    <ThemeContext.Provider value={{ theme, fontSize, density, setTheme, setFontSize, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
};
