import { cn } from '@/lib/utils';
import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import markdownItHighlight from 'markdown-it-highlightjs';
import { CodeBlock } from './CodeBlock';
import ReactDOM from 'react-dom';
import React from 'react';
import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js';

// Register HCL/Terraform language support
hljs.registerLanguage('hcl', require('highlight.js/lib/languages/hcl'));
hljs.registerLanguage('terraform', require('highlight.js/lib/languages/hcl'));

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
      // Map 'terraform' to 'hcl' for proper syntax highlighting
      const mappedLang = lang.toLowerCase() === 'terraform' ? 'hcl' : lang;
      if (mappedLang && str) {
        // Return a placeholder that we'll replace with our CodeBlock component
        return `<pre class="code-block-placeholder" data-language="${mappedLang}" data-code="${encodeURIComponent(str)}"></pre>`;
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

  // Function to render code blocks
  const renderCodeBlock = (node: HTMLElement) => {
    const language = node.getAttribute('data-language') || '';
    const code = decodeURIComponent(node.getAttribute('data-code') || '');
    return <CodeBlock language={language}>{code}</CodeBlock>;
  };

  React.useEffect(() => {
    const container = document.querySelector('.markdown-content');
    if (container) {
      // Find all code block placeholders
      const codeBlocks = container.querySelectorAll('.code-block-placeholder');
      codeBlocks.forEach((block) => {
        if (block instanceof HTMLElement) {
          // Create a wrapper for the CodeBlock component
          const wrapper = document.createElement('div');
          wrapper.className = 'code-block-wrapper';
          block.parentNode?.replaceChild(wrapper, block);
          
          // Render the CodeBlock component into the wrapper
          const codeBlockElement = renderCodeBlock(block);
          ReactDOM.render(codeBlockElement, wrapper);
        }
      });
    }

    // Cleanup function to unmount React components
    return () => {
      const wrappers = document.querySelectorAll('.code-block-wrapper');
      wrappers.forEach((wrapper) => {
        ReactDOM.unmountComponentAtNode(wrapper);
      });
    };
  }, [content]); // Re-run when content changes

  return (
    <div 
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none break-words text-left",
        "prose-pre:bg-slate-950 prose-pre:text-slate-50 dark:prose-pre:bg-slate-900",
        "prose-code:text-slate-900 dark:prose-code:text-slate-100",
        "prose-headings:text-slate-900 dark:prose-headings:text-slate-100",
        "prose-p:text-slate-700 dark:prose-p:text-slate-300"
      )}
    >
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </div>
  );
};