import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';
import { createMarkdownRenderer } from './KaTeXConfig';
import { StyleProvider, getCustomStyles } from './StyleProvider';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const md = createMarkdownRenderer();

  // Handle code blocks
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const code = token.content.trim();
    const lang = token.info || 'text';

    return `<div class="my-4">${CodeBlock({ language: lang, children: code })}</div>`;
  };

  // Process content
  const processedContent = (typeof content === 'string' ? content : JSON.stringify(content))
    .replace(/^```markdown\n([\s\S]*?)```$/g, '$1')
    .replace(/\s*\$\$\s*/g, '$$')
    .replace(/\s*\$\s*/g, '$');

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
        dangerouslySetInnerHTML={{ __html: getCustomStyles() + renderedContent }}
      />
    </StyleProvider>
  );
};