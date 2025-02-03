import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from './CodeBlock';
import { LaTeXBlock } from './LaTeXBlock';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          
          if (!inline && language) {
            return (
              <CodeBlock language={language}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          }
          
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
        math: ({ value }) => <LaTeXBlock content={value} />,
        inlineMath: ({ value }) => <LaTeXBlock content={value} inline />,
      }}
      className="prose dark:prose-invert max-w-none"
    >
      {content}
    </ReactMarkdown>
  );
};