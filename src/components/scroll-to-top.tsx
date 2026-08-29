"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollRoot = document.querySelector<HTMLElement>("[data-page-scroll]");
    scrollRoot?.scrollTo({ top: 0, left: 0 });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
