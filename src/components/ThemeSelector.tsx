
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
      <SelectContent 
        className="z-50 min-w-[180px] overflow-hidden rounded-md border bg-[var(--clr-surface-a10)] border-[var(--clr-surface-a20)]"
      >
        {themes.map((theme) => (
          <SelectItem 
            key={theme.id} 
            value={theme.id}
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-[var(--clr-surface-a50)] hover:bg-[var(--clr-surface-tonal-a10)] focus:bg-[var(--clr-surface-tonal-a10)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
