
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { ThemeSelector } from "./ThemeSelector";

export function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4" />
        <Switch
          checked={mode === 'dark'}
          onCheckedChange={toggleMode}
          aria-label="Toggle dark mode"
        />
        <Moon className="h-4 w-4" />
      </div>
      <ThemeSelector />
    </div>
  );
}
