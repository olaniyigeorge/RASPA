"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Fades content up the first time it scrolls into view. `index` staggers siblings. */
export function Reveal({ children, index = 0, as: Tag = "div", className }: { children: ReactNode; index?: number; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} style={{ "--i": Math.min(index, 8) } as React.CSSProperties} className={cn("reveal", seen && "is-visible", className)}>
      {children}
    </Tag>
  );
}
