import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';
  const { toast } = useToast();

  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Failed to copy text:', err);
          toast({
            description: "Failed to copy text",
            variant: "destructive",
            duration: 2000,
          });
          return;
        } finally {
          textArea.remove();
        }
      }
      
      toast({
        description: "Message copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast({
        description: "Failed to copy text",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in transform transition-all duration-300",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl p-6 transition-all duration-200 backdrop-blur-sm hover:-translate-y-1",
          isAssistant
            ? "bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border border-blue-100/50 dark:border-blue-800/30"
            : "bg-gradient-to-br from-violet-500 to-purple-500 text-white border border-violet-400/20 dark:border-violet-500/20"
        )}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          boxShadow: isAssistant 
            ? '0 4px 6px -1px rgba(148, 163, 184, 0.2), 0 2px 4px -1px rgba(148, 163, 184, 0.1), 0 8px 24px -4px rgba(148, 163, 184, 0.15)'
            : '0 4px 6px -1px rgba(139, 92, 246, 0.3), 0 2px 4px -1px rgba(139, 92, 246, 0.15), 0 8px 24px -4px rgba(139, 92, 246, 0.25)'
        }}
      >
        {isAssistant && (
          <div className="mb-4 flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              onClick={() => handleCopy(message.content)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy response
            </Button>
          </div>
        )}
        <div className="prose prose-slate dark:prose-invert max-w-none break-words text-left">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-4 last:mb-0 leading-relaxed text-left">{children}</p>
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
                const codeText = String(children).replace(/\n$/, '');

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
                  <div className="relative my-6 group rounded-xl overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl border border-slate-200 dark:border-slate-800">
                    <div className="absolute -top-0 right-0 flex items-center gap-2 m-2 z-10">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-mono px-2 py-1 rounded-md bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                        {match[1].toUpperCase()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-200/80 dark:hover:bg-slate-700/80"
                        onClick={() => handleCopy(codeText)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !mt-0 !mb-0 shadow-inner text-left"
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.75rem',
                        background: 'rgba(15, 23, 42, 0.95)',
                      }}
                    >
                      {codeText}
                    </SyntaxHighlighter>
                  </div>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};