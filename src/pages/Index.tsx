
import { useChatSessions } from "@/hooks/useChatSessions";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useState, useEffect } from "react";
import { Message, ChatSession } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_WELCOME_MESSAGE } from "@/config/messages";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";
const STORAGE_KEY = "chat_sessions";
const WELCOME_MESSAGE = import.meta.env.VITE_WELCOME_MESSAGE || DEFAULT_WELCOME_MESSAGE;

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
