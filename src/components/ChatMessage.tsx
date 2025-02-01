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
        description: "Code copied to clipboard",
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
          "max-w-[85%] rounded-2xl p-6 shadow-lg transition-all duration-200 backdrop-blur-sm hover:shadow-xl",
          isAssistant
            ? "bg-gradient-to-br from-blue-50/90 to-blue-100/90 dark:from-blue-900/20 dark:to-blue-800/30 hover:-translate-y-0.5 border border-blue-100/50 dark:border-blue-700/30"
            : "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground hover:-translate-y-0.5 border border-primary/20"
        )}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          boxShadow: isAssistant 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 8px 24px -4px rgba(0, 0, 0, 0.1)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 8px 24px -4px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 dark:from-primary-foreground dark:to-primary-foreground/80">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 dark:from-primary-foreground dark:to-primary-foreground/80">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 dark:from-primary-foreground dark:to-primary-foreground/80">{children}</h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-primary/70 dark:marker:text-primary-foreground/70">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-primary/70 dark:marker:text-primary-foreground/70">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="mb-1 leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/30 dark:border-primary-foreground/30 pl-4 my-4 italic bg-primary/5 dark:bg-primary-foreground/5 py-2 rounded-r">
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
                      "bg-muted/60 backdrop-blur-sm px-1.5 py-0.5 rounded font-mono text-sm border border-muted/30",
                      className
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <div className="relative my-6 group rounded-xl overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl border border-muted/30">
                    <div className="absolute -top-0 right-0 flex items-center gap-2 m-2 z-10">
                      <span className="text-xs text-muted-foreground font-mono px-2 py-1 rounded-md bg-muted/30 backdrop-blur-sm border border-muted/30">
                        {match[1].toUpperCase()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-muted/30 backdrop-blur-sm hover:bg-muted/50"
                        onClick={() => handleCopy(codeText)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !mt-0 !mb-0 shadow-inner"
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.75rem',
                        background: 'rgba(0,0,0,0.8)',
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