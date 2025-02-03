import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { MarkdownRenderer } from './chat/MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';
  const { toast } = useToast();
  const formattedTime = format(new Date(message.timestamp), 'MMM d, yyyy h:mm a');

  const handleCopy = async () => {
    try {
      let contentToCopy = message.content;
      
      // If the content is an object, try to stringify it
      if (typeof contentToCopy === 'object') {
        contentToCopy = JSON.stringify(contentToCopy, null, 2);
      }

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentToCopy;
      
      const cleanText = tempDiv.innerText
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      await navigator.clipboard.writeText(cleanText);
      
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

  // Convert content to string if it's an object
  const messageContent = typeof message.content === 'object' 
    ? JSON.stringify(message.content, null, 2)
    : message.content;

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in transform transition-all duration-300 group",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-200 backdrop-blur-sm hover:-translate-y-1 relative",
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
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {message.imageData && (
            <div className="mb-2">
              <img
                src={`data:${message.imageData.mimeType};base64,${message.imageData.data}`}
                alt={message.imageData.fileName}
                className="max-w-[200px] rounded-lg"
              />
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="markdown-content break-words">
              <MarkdownRenderer content={messageContent} />
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {formattedTime}
          </span>
          {isAssistant && (
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                onClick={handleCopy}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy response
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};