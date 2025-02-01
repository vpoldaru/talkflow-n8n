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
        "flex w-full mb-6 animate-fade-in",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-6 shadow-lg transition-all duration-200",
          isAssistant
            ? "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            : "bg-primary text-primary-foreground hover:opacity-95"
        )}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
            ),
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 text-primary dark:text-primary-foreground">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mb-3 text-primary dark:text-primary-foreground">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold mb-2 text-primary dark:text-primary-foreground">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-primary dark:marker:text-primary-foreground">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-primary dark:marker:text-primary-foreground">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="mb-1 leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/30 dark:border-primary-foreground/30 pl-4 my-4 italic">
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
                    "bg-muted px-1.5 py-0.5 rounded font-mono text-sm",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <div className="relative my-6 group">
                  <div className="absolute -top-4 right-0 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {match[1].toUpperCase()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopy(codeText)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md !mt-0 !mb-0"
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
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
  );
};