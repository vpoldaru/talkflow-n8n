import { useChatSessions } from "@/hooks/useChatSessions";
import { ChatLayout } from "@/components/chat/ChatLayout";

const Index = () => {
  const {
    sessions,
    currentSessionId,
    isLoading,
    isTyping,
    createNewSession,
    deleteSession,
    sendMessage,
    setCurrentSessionId,
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
      onSendMessage={sendMessage}
    />
  );
};

export default Index;