import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';
import { createMarkdownRenderer } from './KaTeXConfig';
import { StyleProvider } from './StyleProvider';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const md = createMarkdownRenderer();

  // Process the content
  const processedContent = (typeof content === 'string' ? content : JSON.stringify(content))
    .replace(/^```markdown\n([\s\S]*?)```$/g, '$1')
    .replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_, math) => {
      return `\`\`\`math\n$$${math}$$\n\`\`\``;
    });

  // Render the markdown content
  const renderedContent = md.render(processedContent);

  return (
    <StyleProvider>
      <div 
        className={cn(
          "prose prose-slate dark:prose-invert max-w-none break-words text-left",
          "prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100",
          "prose-p:text-slate-700 dark:prose-p:text-slate-300",
          "prose-strong:text-slate-900 dark:prose-strong:text-white",
          "prose-code:text-slate-900 dark:prose-code:text-slate-100",
          "prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800",
          "prose-hr:border-slate-200 dark:prose-hr:border-slate-700"
        )}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </StyleProvider>
  );
};