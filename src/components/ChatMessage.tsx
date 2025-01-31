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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description: "Code copied to clipboard",
        duration: 2000,
      });
    });
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isAssistant
            ? "bg-blue-50 dark:bg-blue-900/20"
            : "bg-primary text-primary-foreground"
        )}
      >
        <ReactMarkdown
          components={{
            // Add proper spacing for paragraphs and other text elements
            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            // Add spacing for headings
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
            // Add spacing for lists
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
            // Add spacing for list items
            li: ({ children }) => <li className="mb-1">{children}</li>,
            // Style blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">
                {children}
              </blockquote>
            ),
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              const codeText = String(children).replace(/\n$/, '');

              return isInline ? (
                <code className={cn("bg-muted px-1 py-0.5 rounded", className)} {...props}>
                  {children}
                </code>
              ) : (
                <div className="relative my-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleCopy(codeText)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md"
                  >
                    {codeText}
                  </SyntaxHighlighter>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleCopy(codeText)}
                    >
                      <Copy className="h-4 w-4" />
                      Copy code
                    </Button>
                  </div>
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