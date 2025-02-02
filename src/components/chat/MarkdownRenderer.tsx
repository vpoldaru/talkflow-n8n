import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // Check if content is LaTeX-heavy (contains multiple LaTeX expressions)
  const latexPatterns = [/\\\[.*?\\\]/gs, /\\\(.*?\\\)/gs, /\$\$.*?\$\$/gs, /\$.*?\$/gs];
  const latexCount = latexPatterns.reduce((count, pattern) => 
    count + (content.match(pattern)?.length || 0), 0);
  
  // If there are multiple LaTeX expressions, render the entire content as a code block
  if (latexCount > 2) {
    return (
      <CodeBlock language="latex">
        {content}
      </CodeBlock>
    );
  }

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use(mk);

  // Custom renderer configuration
  md.renderer.rules.paragraph_open = () => '<p class="mb-2 last:mb-0 leading-relaxed text-left">';
  md.renderer.rules.heading_open = (tokens, idx) => {
    const level = tokens[idx].tag;
    const classes = {
      h1: 'text-2xl font-bold mb-4',
      h2: 'text-xl font-bold mb-3',
      h3: 'text-lg font-bold mb-2'
    }[level] || '';
    
    return `<${level} class="${classes} bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-left">`;
  };

  // Handle code blocks
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const code = token.content.trim();
    const lang = token.info || 'text';

    if (lang === 'math' || /^\$.*\$$/s.test(code)) {
      return `<div class="my-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm overflow-x-auto">${code}</div>`;
    }

    return `<div class="my-4">${CodeBlock({ language: lang, children: code })}</div>`;
  };

  // Render the markdown content
  const renderedContent = md.render(content);

  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none break-words text-left"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};