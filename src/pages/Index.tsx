import { useChatSessions } from "@/hooks/useChatSessions";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  // Allow rendering even without window.env since we'll fall back to import.meta.env
  console.log('Index component rendering. window.env available:', !!window.env);
  
  const navigate = useNavigate();
  
  const {
    sessions,
    currentSessionId,
    isLoading,
    isTyping,
    createNewSession,
    deleteSession,
    renameSession,
    sendMessage,
    setCurrentSessionId,
    toggleFavorite,
  } = useChatSessions();

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background shadow-sm">
        <div className="flex justify-end p-4 container max-w-[1400px] mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/playground')}
            className="gap-2 hover:bg-accent"
          >
            <Code className="h-4 w-4" />
            Code Playground
          </Button>
        </div>
      </div>
      <div className="flex-1 pt-16">
        <ChatLayout
          sessions={sessions}
          currentSessionId={currentSessionId}
          isLoading={isLoading}
          isTyping={isTyping}
          onNewChat={createNewSession}
          onSessionSelect={setCurrentSessionId}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          onToggleFavorite={toggleFavorite}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Index;