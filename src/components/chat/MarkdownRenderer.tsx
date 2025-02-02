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
  const processedContent = (typeof content === 'string' ? content : JSON.stringify(content))
    // Remove markdown code block markers if present
    .replace(/^```markdown\n([\s\S]*?)```$/g, '$1')
    // Handle block math mode ($$...$$) - must be on separate lines
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => `\n\\[\n${math.trim()}\n\\]\n`)
    // Handle inline math mode ($...$) - must not break across lines
    .replace(/\$([^\n$]*?)\$/g, (_, math) => `\\(${math.trim()}\\)`)
    // Handle already processed KaTeX
    .replace(/\\[\[\(]([\s\S]*?)\\[\]\)]/g, (match) => match);

  // Add custom styles for KaTeX
  const customStyles = `
    <style>
      .katex { font-size: 1.1em; }
      .katex-display { 
        overflow: auto hidden;
        margin: 1em 0;
        padding: 1em;
        background: rgba(0, 0, 0, 0.03);
        border-radius: 0.375rem;
      }
      .katex-display > .katex { 
        white-space: normal;
        text-align: center;
      }
      /* Dark mode styles */
      .dark .katex { color: #e5e7eb; }
      .dark .katex-display { background: rgba(30, 41, 59, 0.5); }
      /* Additional styles for better visibility */
      .markdown-content { color: inherit; }
      .markdown-content p { margin-bottom: 1rem; }
      .markdown-content hr { margin: 1.5rem 0; }
      .markdown-content h3 { color: #1e293b; }
      .dark .markdown-content h3 { color: #e5e7eb; }
    </style>
  `;

  // Render the markdown content
  const renderedContent = md.render(processedContent);

  return (
    <div 
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none break-words text-left markdown-content",
        "prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100",
        "prose-p:text-slate-700 dark:prose-p:text-slate-300",
        "prose-strong:text-slate-900 dark:prose-strong:text-white",
        "prose-code:text-slate-900 dark:prose-code:text-slate-100",
        "prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800",
        "prose-hr:border-slate-200 dark:prose-hr:border-slate-700"
      )}
      dangerouslySetInnerHTML={{ __html: customStyles + renderedContent }}
    />
  );
};