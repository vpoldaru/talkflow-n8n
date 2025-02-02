import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface LaTeXBlockProps {
  content: string;
  inline?: boolean;
}

export const LaTeXBlock = ({ content, inline = false }: LaTeXBlockProps) => {
  return (
    <div className={cn(
      "relative group",
      inline ? "inline-block" : "my-6"
    )}>
      <div className={cn(
        "rounded-xl overflow-hidden transition-all duration-200",
        !inline && "shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-800"
      )}>
        <div className={cn(
          "bg-slate-50 dark:bg-slate-900",
          !inline && "p-4"
        )}>
          {/* The actual LaTeX content will be rendered by KaTeX through rehype-katex */}
          {content}
        </div>
      </div>
    </div>
  );
};