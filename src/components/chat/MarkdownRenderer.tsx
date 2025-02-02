import { cn } from '@/lib/utils';
import { createMarkdownRenderer } from './KaTeXConfig';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const md = createMarkdownRenderer();

  // Process the content
  const processedContent = (typeof content === 'string' ? content : JSON.stringify(content))
    // Ensure proper spacing around block math
    .replace(/\$\$(.*?)\$\$/g, '\n\n$$\n$1\n$$\n\n')
    // Clean up excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Render the markdown content
  const renderedContent = md.render(processedContent);

  return (
    <div 
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none break-words text-left",
        "prose-pre:bg-slate-950 prose-pre:text-slate-50 dark:prose-pre:bg-slate-900",
        "prose-code:text-slate-900 dark:prose-code:text-slate-100",
        "prose-headings:text-slate-900 dark:prose-headings:text-slate-100",
        "prose-p:text-slate-700 dark:prose-p:text-slate-300"
      )}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};