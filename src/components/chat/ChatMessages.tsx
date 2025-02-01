import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea 
      className="flex-1 p-4 space-y-4 pt-16 md:pt-4"
      style={{
        background: `
          linear-gradient(to bottom, 
            hsl(var(--background)) 0%,
            hsl(var(--muted)/0.3) 100%
          ),
          radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)
        `,
        backgroundSize: '100% 100%, 24px 24px'
      }}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </ScrollArea>
  );
};