"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const languages = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "RU", name: "Русский", flag: "🇷🇺" },
  { code: "KR", name: "한국어", flag: "🇰🇷" },
];

export function LanguageSwitcher() {
  // TODO: CHANGE DYNAMIC LANGUAGE
  const [currentLang, setCurrentLang] = React.useState(languages[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 h-10 border-input hover:bg-muted transition-all cursor-pointer"
        >
          <Globe className="size-4 text-foreground" />
          <span className="text-sm font-bold tracking-tighter">
            {currentLang.code}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-40 rounded-2xl p-2 shadow-xl border-border"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center gap-3 rounded-xl cursor-pointer py-2.5 focus:bg-muted transition-colors"
            onClick={() => setCurrentLang(lang)}
          >
            <span className="text-lg leading-none">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
