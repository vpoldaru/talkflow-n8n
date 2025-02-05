
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LaTeXBlockProps {
  content: string;
  inline?: boolean;
}

export const LaTeXBlock = ({ content, inline = false }: LaTeXBlockProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        description: "LaTeX copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        description: "Failed to copy LaTeX",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  if (inline) {
    return (
      <code className="bg-[var(--clr-surface-tonal-a10)] text-[var(--clr-surface-a50)] px-1.5 py-0.5 rounded font-mono text-sm">
        {content}
      </code>
    );
  }

  return (
    <div className="relative group my-4">
      <div className="rounded-lg border border-[var(--clr-surface-a20)] bg-[var(--clr-surface-tonal-a0)]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--clr-surface-a20)] bg-[var(--clr-surface-tonal-a10)]">
          <div className="text-xs text-[var(--clr-surface-a40)]">LaTeX</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[var(--clr-surface-a40)] hover:text-[var(--clr-surface-a50)]"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 overflow-auto font-mono text-sm text-[var(--clr-surface-a50)]">
          {content}
        </div>
      </div>
    </div>
  );
};
