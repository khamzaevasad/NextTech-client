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
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/actions/locale";

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "kr", label: "KR", name: "한국어" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const [currentCode, setCurrentCode] = React.useState("en");

  React.useEffect(() => {
    const match = document.cookie.match(/locale=([^;]+)/);
    if (match) setCurrentCode(match[1]);
  }, []);

  const currentLang =
    languages.find((l) => l.code === currentCode) || languages[0];

  const handleChange = async (code: string) => {
    await setLocale(code);
    setCurrentCode(code);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Globe className="h-4 w-4" />
          {currentLang.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`cursor-pointer ${
              currentLang.code === lang.code ? "font-semibold text-primary" : ""
            }`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
