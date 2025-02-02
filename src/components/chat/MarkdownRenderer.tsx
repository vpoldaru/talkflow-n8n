import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
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