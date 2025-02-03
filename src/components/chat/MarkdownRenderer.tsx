import React from 'react';
import { cn } from '@/lib/utils';
import { createMarkdownRenderer } from '@/utils/markdownConfig';
import { CodeBlockRenderer } from './CodeBlockRenderer';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const md = React.useMemo(() => createMarkdownRenderer(), []);

  const processContent = React.useCallback((rawContent: string) => {
    return (typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent))
      .replace(/\$\$(.*?)\$\$/g, '\n\n$$\n$1\n$$\n\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }, []);

  const renderedContent = React.useMemo(() => {
    const processedContent = processContent(content);
    return md.render(processedContent);
  }, [content, md, processContent]);

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
      <CodeBlockRenderer container={document.querySelector('.markdown-content') as Element} />
    </div>
  );
};