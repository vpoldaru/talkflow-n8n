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
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => navigate('/playground')}
        className="fixed top-4 right-4 z-50 gap-2"
      >
        <Code className="h-4 w-4" />
        Code Playground
      </Button>
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
  );
};

export default Index;