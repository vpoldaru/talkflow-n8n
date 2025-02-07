
import { Check, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const themes = {
  default: {
    name: "Default",
    variables: {
      "--background": "220 20% 97%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 84% 4.9%",
      "--primary": "222.2 47.4% 11.2%",
      "--primary-foreground": "210 40% 98%",
      "--secondary": "210 40% 96.1%",
      "--secondary-foreground": "222.2 47.4% 11.2%",
      "--muted": "210 40% 96.1%",
      "--muted-foreground": "215.4 16.3% 46.9%",
      "--accent": "210 40% 96.1%",
      "--accent-foreground": "222.2 47.4% 11.2%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "210 40% 98%",
      "--border": "214.3 31.8% 91.4%",
      "--input": "214.3 31.8% 91.4%",
      "--ring": "222.2 84% 4.9%",
      "--radius": "0.5rem",
    },
  },
  purple: {
    name: "Purple Dream",
    variables: {
      "--background": "270 20% 97%",
      "--foreground": "272 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "272 84% 4.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "272 84% 4.9%",
      "--primary": "267 47.4% 11.2%",
      "--primary-foreground": "270 40% 98%",
      "--secondary": "270 40% 96.1%",
      "--secondary-foreground": "267 47.4% 11.2%",
      "--muted": "270 40% 96.1%",
      "--muted-foreground": "265.4 16.3% 46.9%",
      "--accent": "270 40% 96.1%",
      "--accent-foreground": "267 47.4% 11.2%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "270 40% 98%",
      "--border": "264.3 31.8% 91.4%",
      "--input": "264.3 31.8% 91.4%",
      "--ring": "267 84% 4.9%",
      "--radius": "0.5rem",
    },
  },
  ocean: {
    name: "Ocean Breeze",
    variables: {
      "--background": "200 20% 97%",
      "--foreground": "202 84% 4.9%",
      "--card": "0 0% 100%",
      "--card-foreground": "202 84% 4.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "202 84% 4.9%",
      "--primary": "197 47.4% 11.2%",
      "--primary-foreground": "200 40% 98%",
      "--secondary": "200 40% 96.1%",
      "--secondary-foreground": "197 47.4% 11.2%",
      "--muted": "200 40% 96.1%",
      "--muted-foreground": "195.4 16.3% 46.9%",
      "--accent": "200 40% 96.1%",
      "--accent-foreground": "197 47.4% 11.2%",
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "200 40% 98%",
      "--border": "194.3 31.8% 91.4%",
      "--input": "194.3 31.8% 91.4%",
      "--ring": "197 84% 4.9%",
      "--radius": "0.5rem",
    },
  },
};

export type ThemeKey = keyof typeof themes;

export function ThemePicker() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem("theme-color");
    return (saved as ThemeKey) || "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeVars = themes[currentTheme].variables;
    const isDark = root.classList.contains("dark");
    
    Object.entries(themeVars).forEach(([key, value]) => {
      if (isDark && key === "--background") {
        // Preserve dark mode background
        return;
      }
      root.style.setProperty(key, value);
    });
    
    localStorage.setItem("theme-color", currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (theme: ThemeKey) => {
    setCurrentTheme(theme);
    toast.success(`Theme changed to ${themes[theme].name}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(themes).map(([key, theme]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleThemeChange(key as ThemeKey)}
            className="flex items-center justify-between"
          >
            {theme.name}
            {currentTheme === key && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
