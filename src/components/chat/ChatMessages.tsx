
import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
}

export const ChatMessages = ({ messages, isTyping = false }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea 
      className="flex-1 p-4 space-y-8 pt-16 md:pt-4 pb-32"
      style={{
        background: `
          linear-gradient(to bottom, 
            var(--clr-surface-a0) 0%,
            var(--clr-surface-tonal-a0) 100%
          ),
          radial-gradient(
            circle at 2px 2px,
            var(--clr-surface-tonal-a10) 1px,
            transparent 0
          )
        `,
        backgroundSize: '100% 100%, 24px 24px'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-[900px] mx-auto space-y-12">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-[var(--clr-surface-a40)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Responding...</span>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
    </ScrollArea>
  );
};
