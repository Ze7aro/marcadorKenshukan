import { useEffect, useState } from "react";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints: Record<Breakpoint, string> = {
  base: "(max-width: 639px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base");

  useEffect(() => {
    const queries = Object.entries(breakpoints).map(([key, query]) => {
      const mq = window.matchMedia(query);
      const listener = (e: MediaQueryListEvent) => {
        if (e.matches) setBreakpoint(key as Breakpoint);
      };

      mq.addEventListener("change", listener);

      if (mq.matches) setBreakpoint(key as Breakpoint);

      return () => mq.removeEventListener("change", listener);
    });

    return () => {
      queries.forEach((cleanup) => cleanup());
    };
  }, []);

  return breakpoint;
}
