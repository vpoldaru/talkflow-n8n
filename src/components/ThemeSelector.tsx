
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
        className="w-[180px] bg-[var(--clr-surface-a10)] text-[var(--clr-surface-a50)] border-[var(--clr-surface-a20)]"
      >
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent className="bg-[var(--clr-surface-a0)] border-[var(--clr-surface-a20)]">
        {themes.map((theme) => (
          <SelectItem 
            key={theme.id} 
            value={theme.id}
            className="text-[var(--clr-surface-a50)] hover:bg-[var(--clr-surface-tonal-a10)]"
          >
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
