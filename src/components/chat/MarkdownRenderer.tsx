import { cn } from '@/lib/utils';
import { createMarkdownRenderer } from './KaTeXConfig';
import { CodeBlock } from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const md = createMarkdownRenderer();

  // Configure markdown-it to use custom renderer for code blocks
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const lang = token.info.trim();
    const content = token.content;
    
    // Return custom CodeBlock component for code fences
    return `<div class="code-block-wrapper">${CodeBlock({ 
      language: lang || 'plaintext',
      children: content
    }).props.children}</div>`;
  };

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
        "prose-p:text-slate-700 dark:prose-p:text-slate-300",
        // Add specific styling for code blocks
        "[&_.code-block-wrapper]:my-4",
        "[&_pre]:rounded-lg [&_pre]:p-4",
        "[&_code]:text-sm [&_code]:leading-relaxed"
      )}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};