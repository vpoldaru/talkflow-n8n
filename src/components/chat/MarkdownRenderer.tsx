import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed text-left">{children}</p>
        ),
        img: ({ src, alt }) => (
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full h-auto rounded-lg my-2 border border-slate-200 dark:border-slate-700"
            style={{ maxHeight: '400px' }}
          />
        ),
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-left">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-left">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-left">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-slate-500 dark:marker:text-slate-400 text-left">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-slate-500 dark:marker:text-slate-400 text-left">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="mb-1 leading-relaxed text-left">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-violet-300 dark:border-violet-600 pl-4 my-4 italic bg-violet-50/30 dark:bg-violet-900/20 py-2 rounded-r text-left">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match;
          return isInline ? (
            <code
              className={cn(
                "bg-slate-100 dark:bg-slate-800 backdrop-blur-sm px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200 dark:border-slate-700",
                className
              )}
              {...props}
            >
              {children}
            </code>
          ) : (
            <CodeBlock language={match[1]}>
              {String(children).replace(/\n$/, '')}
            </CodeBlock>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};