"use client";

import { createContext, useContext } from "react";

export const MobileNavContext = createContext<{ openMobileNav: () => void }>({
  openMobileNav: () => {},
});

export const useMobileNav = () => useContext(MobileNavContext);
