"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingBarProps {
  loading: boolean;
  className?: string;
}

export function LoadingBar({ loading, className }: LoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      const timer0 = setTimeout(() => setProgress(10), 0);
      const timer1 = setTimeout(() => setProgress(60), 100);
      const timer2 = setTimeout(() => setProgress(80), 300);

      return () => {
        clearTimeout(timer0);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      const timer = setTimeout(() => setProgress(100), 0);
      const timer2 = setTimeout(() => setProgress(0), 400);
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }
  }, [loading]);

  if (progress === 0) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-1 bg-transparent",
        className,
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 shadow-lg shadow-pink-500/50 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100 ? "width 200ms ease-out" : "width 300ms ease-out",
        }}
      />
    </div>
  );
}
