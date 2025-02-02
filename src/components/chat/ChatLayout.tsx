import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatSession } from "@/types/chat";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatLayoutProps {
  sessions: ChatSession[];
  currentSessionId: string;
  isLoading: boolean;
  isTyping: boolean;
  onNewChat: () => void;
  onSessionSelect: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onSendMessage: (message: string) => void;
}

export const ChatLayout = ({
  sessions,
  currentSessionId,
  isLoading,
  isTyping,
  onNewChat,
  onSessionSelect,
  onDeleteSession,
  onSendMessage,
}: ChatLayoutProps) => {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (pendingImage) {
      const formData = new FormData();
      formData.append('file', pendingImage);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        const { url } = await response.json();
        const imageMarkdown = `${input}\n\n![Uploaded Image](${url})`;
        onSendMessage(imageMarkdown);
        setPendingImage(null);
        
        toast({
          description: "Message with image sent successfully",
          duration: 2000,
        });
      } catch (error) {
        toast({
          description: "Failed to upload image",
          variant: "destructive",
        });
        return;
      }
    } else {
      onSendMessage(input);
    }
    
    setInput("");
  };

  const handleImageSelect = (file: File) => {
    setPendingImage(file);
  };

  const handleSessionClick = (sessionId: string) => {
    onSessionSelect(sessionId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        isSidebarOpen={isSidebarOpen}
        onNewChat={onNewChat}
        onSessionSelect={handleSessionClick}
        onDeleteSession={onDeleteSession}
      />

      <div className="flex-1 flex flex-col bg-background relative pb-6">
        {currentSession && (
          <>
            <ChatMessages messages={currentSession.messages} isTyping={isTyping} />
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSend={handleSend}
              onImageSelect={handleImageSelect}
            />
          </>
        )}
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
