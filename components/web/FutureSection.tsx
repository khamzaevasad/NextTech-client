"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { CpuIcon, StoreIcon, ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DecorIcon } from "../ui/decor-icon";

type FeatureType = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

export function FeatureSection() {
  const t = useTranslations("home.features");

  const features: FeatureType[] = [
    {
      title: t("f1_title"),
      icon: <CpuIcon />,
      description: t("f1_desc"),
    },
    {
      title: t("f2_title"),
      icon: <StoreIcon />,
      description: t("f2_desc"),
    },
    {
      title: t("f3_title"),
      icon: <ShieldCheckIcon />,
      description: t("f3_desc"),
    },
  ];

  return (
    <div className="py-12 px-4">
      <div className="relative">
        <DecorIcon
          className="size-6 stroke-2 stroke-border"
          position="top-left"
        />
        <DecorIcon
          className="size-6 stroke-2 stroke-border"
          position="top-right"
        />
        <DecorIcon
          className="size-6 stroke-2 stroke-border"
          position="bottom-left"
        />
        <DecorIcon
          className="size-6 stroke-2 stroke-border"
          position="bottom-right"
        />

        <DashedLine className="-top-[1.5px] right-3 left-3" />
        <DashedLine className="top-3 -right-[1.5px] bottom-3" />
        <DashedLine className="top-3 bottom-3 -left-[1.5px]" />
        <DashedLine className="right-3 -bottom-[1.5px] left-3" />

        <div className="grid grid-cols-1 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              className="group relative p-8 transition-colors hover:bg-muted/30 dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)]"
              key={idx}
            >
              <div className="mb-4 size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {React.cloneElement(
                  feature.icon as React.ReactElement<Record<string, unknown>>,
                  {
                    className: "size-6",
                  },
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
              <DashedLine className="right-5 bottom-0 left-5 group-last:hidden md:top-5 md:right-0 md:bottom-5 md:left-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashedLine({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "absolute border-collapse border border-dashed border-border/50",
        className,
      )}
      {...props}
    />
  );
}
