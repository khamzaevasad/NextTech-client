"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  speed?: number;
  speedOnHover?: number;
  reverse?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  speed = 1,
  speedOnHover,
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const childrenArray = React.Children.toArray(children);
  const duplicatedChildren = [...childrenArray, ...childrenArray];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="flex"
        style={{ gap: `${gap}px` }}
        animate={{
          x: reverse ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: duration / speed,
            ease: "linear",
          },
        }}
        whileHover={
          speedOnHover
            ? {
                transition: {
                  duration: duration / speedOnHover,
                },
              }
            : undefined
        }
      >
        {duplicatedChildren.map((child, index) => (
          <div key={index} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
