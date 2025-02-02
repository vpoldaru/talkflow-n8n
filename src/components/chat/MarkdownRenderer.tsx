import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // Initialize markdown-it with katex plugin and all options
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  }).use(mk, {
    throwOnError: false,
    errorColor: ' #cc0000',
    strict: false,
    trust: true,
    macros: {
      "\\RR": "\\mathbb{R}"
    }
  });

  // Custom renderer rules
  md.renderer.rules.paragraph_open = () => '<p class="mb-4 last:mb-0 leading-relaxed text-left">';
  
  md.renderer.rules.heading_open = (tokens, idx) => {
    const level = tokens[idx].tag;
    const classes = {
      h1: 'text-2xl font-bold mb-4 mt-6',
      h2: 'text-xl font-bold mb-3 mt-5',
      h3: 'text-lg font-bold mb-2 mt-4',
      h4: 'text-base font-bold mb-2 mt-3',
      h5: 'text-sm font-bold mb-2 mt-2',
      h6: 'text-xs font-bold mb-2 mt-2'
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

  // Process content to properly handle LaTeX delimiters
  const processedContent = content
    // Handle display math mode
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => `\\[${math.trim()}\\]`)
    // Handle inline math mode
    .replace(/\$([^$\n]+?)\$/g, (_, math) => `\\(${math.trim()}\\)`)
    // Handle already processed KaTeX
    .replace(/\\[\[\(]([\s\S]*?)\\[\]\)]/g, (match) => match);

  // Add custom styles for KaTeX
  const customStyles = `
    <style>
      .katex { font-size: 1.1em; }
      .katex-display { overflow: auto hidden; }
      .katex-display > .katex { white-space: normal; }
      /* Dark mode styles */
      .dark .katex { color: #e5e7eb; }
      .dark .katex-display { background: rgba(30, 41, 59, 0.5); }
    </style>
  `;

  // Render the markdown content
  const renderedContent = md.render(processedContent);

  return (
    <div 
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none break-words text-left",
        "prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100",
        "prose-p:text-slate-700 dark:prose-p:text-slate-300",
        "prose-strong:text-slate-900 dark:prose-strong:text-white",
        "prose-code:text-slate-900 dark:prose-code:text-slate-100",
        "prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800"
      )}
      dangerouslySetInnerHTML={{ __html: customStyles + renderedContent }}
    />
  );
};