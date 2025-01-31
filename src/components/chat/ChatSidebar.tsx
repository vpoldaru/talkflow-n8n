import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatSession } from "@/types/chat";
import { MessageSquare, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  isSidebarOpen: boolean;
  onNewChat: () => void;
  onSessionSelect: (sessionId: string) => void;
}

export const ChatSidebar = ({
  sessions,
  currentSessionId,
  isSidebarOpen,
  onNewChat,
  onSessionSelect,
}: ChatSidebarProps) => {
  const getFirstMessage = (messages: ChatSession["messages"]) => {
    const userMessage = messages.find(m => m.role === "user");
    return userMessage ? userMessage.content : "New Chat";
  };

  return (
    <div
      className={cn(
        "w-64 border-r bg-sidebar flex flex-col absolute md:relative z-40 h-full transition-transform duration-200 ease-in-out",
        !isSidebarOpen && "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="p-4 border-b flex flex-col gap-4">
        <Button onClick={onNewChat} className="w-full flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          New Chat
        </Button>
        <ThemeToggle />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSessionSelect(session.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors",
                "flex items-center gap-2 text-sm",
                session.id === currentSessionId && "bg-sidebar-accent"
              )}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <div className="truncate flex-1">
                <div className="font-medium truncate">
                  {getFirstMessage(session.messages)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(session.lastUpdated, 'MMM d, h:mm a')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};