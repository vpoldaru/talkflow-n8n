
import { useChatSessions } from "@/hooks/useChatSessions";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { ThemeProvider } from "@/hooks/useTheme";

const Index = () => {
  // Allow rendering even without window.env since we'll fall back to import.meta.env
  console.log('Index component rendering. window.env available:', !!window.env);
  
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
      <ThemeProvider>
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
      </ThemeProvider>
    </div>
  );
};

export default Index;
