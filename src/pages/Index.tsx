import { useChatSessions } from "@/hooks/useChatSessions";
import { ChatLayout } from "@/components/chat/ChatLayout";

const Index = () => {
  // Ensure window.env exists before rendering
  if (!window.env) {
    console.error('Docker environment variables not loaded');
    return <div>Loading configuration...</div>;
  }

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
  );
};

export default Index;