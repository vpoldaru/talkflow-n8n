
import { themes } from "@/config/themes";
import { useTheme } from "@/hooks/useTheme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme();

  return (
    <Select value={currentTheme.id} onValueChange={setTheme}>
      <SelectTrigger 
        className="w-[180px] bg-background text-foreground border-border"
      >
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent 
        className="z-50 min-w-[180px] overflow-hidden rounded-md border bg-background text-foreground shadow-md border-border"
      >
        {themes.map((theme) => (
          <SelectItem 
            key={theme.id} 
            value={theme.id}
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-foreground hover:bg-accent focus:bg-accent"
          >
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
