import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // Initialize markdown-it with katex plugin
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use(mk, {
    throwOnError: false,
    errorColor: ' #cc0000',
    strict: false
  });

  // Custom renderer configuration
  md.renderer.rules.paragraph_open = () => '<p class="mb-2 last:mb-0 leading-relaxed text-left">';
  
  md.renderer.rules.heading_open = (tokens, idx) => {
    const level = tokens[idx].tag;
    const classes = {
      h1: 'text-2xl font-bold mb-4',
      h2: 'text-xl font-bold mb-3',
      h3: 'text-lg font-bold mb-2'
    }[level] || '';
    
    return `<${level} class="${classes} text-left">`;
  };

  // Handle code blocks
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const code = token.content.trim();
    const lang = token.info || 'text';

    return `<div class="my-4">${CodeBlock({ language: lang, children: code })}</div>`;
  };

  // Process the content to properly handle LaTeX delimiters
  let processedContent = content
    // Handle display math mode
    .replace(/\$\$(.*?)\$\$/gs, '\\[$1\\]')
    // Handle inline math mode
    .replace(/\$(.*?)\$/g, '\\($1\\)');

  // Render the markdown content
  const renderedContent = md.render(processedContent);

  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none break-words text-left"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};