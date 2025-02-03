import { cn } from '@/lib/utils';
import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import markdownItHighlight from 'markdown-it-highlightjs';
import { CodeBlock } from '../CodeBlock';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
      if (lang && str) {
        // Return a placeholder that we'll replace with our CodeBlock component
        return `<pre class="code-block-placeholder" data-language="${lang}" data-code="${encodeURIComponent(str)}"></pre>`;
      }
      return ''; // use external default escaping
    }
  });

  // Configure plugins
  md.use(markdownItKatex)
    .use(markdownItHighlight);

  // Process the content
  const processedContent = (typeof content === 'string' ? content : JSON.stringify(content))
    // Ensure proper spacing around block math
    .replace(/\$\$(.*?)\$\$/g, '\n\n$$\n$1\n$$\n\n')
    // Clean up excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Render markdown to HTML
  let renderedContent = md.render(processedContent);

  // Replace code block placeholders with actual CodeBlock components
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = renderedContent;

  // Find all code block placeholders
  const codeBlocks = tempDiv.querySelectorAll('.code-block-placeholder');
  codeBlocks.forEach((block) => {
    const language = block.getAttribute('data-language') || '';
    const code = decodeURIComponent(block.getAttribute('data-code') || '');
    
    // Create a wrapper for the CodeBlock component
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    wrapper.setAttribute('data-language', language);
    wrapper.setAttribute('data-code', code);
    
    block.parentNode?.replaceChild(wrapper, block);
  });

  renderedContent = tempDiv.innerHTML;

  // Function to render code blocks
  const renderCodeBlock = (node: HTMLElement) => {
    const language = node.getAttribute('data-language') || '';
    const code = node.getAttribute('data-code') || '';
    return <CodeBlock language={language}>{code}</CodeBlock>;
  };

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
      ref={(el) => {
        if (el) {
          // Replace code block wrappers with actual CodeBlock components
          el.querySelectorAll('.code-block-wrapper').forEach((wrapper) => {
            if (wrapper instanceof HTMLElement) {
              const codeBlockElement = renderCodeBlock(wrapper);
              // @ts-ignore - React 18 createRoot API
              const root = ReactDOM.createRoot(wrapper);
              root.render(codeBlockElement);
            }
          });
        }
      }}
    />
  );
};