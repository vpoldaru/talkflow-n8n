import { useState, useEffect } from "react";
import { Message, ChatSession } from "@/types/chat";
import { v4 as uuidv4 } from 'uuid';
import { useMessageSender } from "./useMessageSender";
import { useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "chat_sessions";

// Fallback to import.meta.env if window.env is not available
console.log('Configuration Sources:');
console.log('window.env:', {
  VITE_N8N_WEBHOOK_URL: window.env?.VITE_N8N_WEBHOOK_URL ? '[CONFIGURED]' : '[NOT SET]',
  VITE_WELCOME_MESSAGE: window.env?.VITE_WELCOME_MESSAGE,
  VITE_SITE_TITLE: window.env?.VITE_SITE_TITLE,
  VITE_N8N_WEBHOOK_USERNAME: window.env?.VITE_N8N_WEBHOOK_USERNAME ? '[CONFIGURED]' : '[NOT SET]',
  VITE_N8N_WEBHOOK_SECRET: window.env?.VITE_N8N_WEBHOOK_SECRET ? '[CONFIGURED]' : '[NOT SET]'
});
console.log('import.meta.env:', {
  VITE_N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL ? '[CONFIGURED]' : '[NOT SET]',
  VITE_WELCOME_MESSAGE: import.meta.env.VITE_WELCOME_MESSAGE,
  VITE_SITE_TITLE: import.meta.env.VITE_SITE_TITLE,
  VITE_N8N_WEBHOOK_USERNAME: import.meta.env.VITE_N8N_WEBHOOK_USERNAME ? '[CONFIGURED]' : '[NOT SET]',
  VITE_N8N_WEBHOOK_SECRET: import.meta.env.VITE_N8N_WEBHOOK_SECRET ? '[CONFIGURED]' : '[NOT SET]'
});
console.log('DEFAULT_WELCOME_MESSAGE:', "Welcome to the chat!.");

const WELCOME_MESSAGE = window.env?.VITE_WELCOME_MESSAGE || import.meta.env.VITE_WELCOME_MESSAGE || "Welcome to the chat!";

console.log('WELCOME_MESSAGE sources:');
console.log('- window.env.VITE_WELCOME_MESSAGE:', window.env?.VITE_WELCOME_MESSAGE);
console.log('- import.meta.env.VITE_WELCOME_MESSAGE:', import.meta.env.VITE_WELCOME_MESSAGE);
console.log('- DEFAULT_WELCOME_MESSAGE:', "Welcome to the chat!.");
console.log('Selected WELCOME_MESSAGE:', WELCOME_MESSAGE);

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const queryClient = useQueryClient();

  const updateSession = (sessionId: string, messages: Message[]) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages, lastUpdated: Date.now() }
        : session
    ));
    queryClient.setQueryData(['chatSessions', sessionId], messages);
  };

  const { sendMessage: sendMessageToWebhook, isLoading, isTyping } = useMessageSender(
    updateSession,
    queryClient
  );

  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (parsed.length > 0) {
        setCurrentSessionId(parsed[0].id);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      messages: [{
        id: uuidv4(),
        content: WELCOME_MESSAGE,
        role: "assistant",
        timestamp: Date.now(),
      }],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const getCurrentSession = () => {
    return sessions.find(s => s.id === currentSessionId);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (sessionId === currentSessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const renameSession = (sessionId: string, newName: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, name: newName }
        : session
    ));
  };

  const sendMessage = async (input: string, file?: File) => {
    const currentSession = getCurrentSession();
    if (!currentSession) return;
    
    // Set initial state in React Query cache
    queryClient.setQueryData(['chatSessions', currentSession.id], currentSession.messages);
    
    await sendMessageToWebhook(
      input,
      currentSession.id,
      currentSession.messages,
      file
    );
  };

  const toggleFavorite = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, favorite: !session.favorite }
        : session
    ));
  };

  return {
    sessions,
    currentSessionId,
    isLoading,
    isTyping,
    getCurrentSession,
    createNewSession,
    deleteSession,
    renameSession,
    sendMessage,
    setCurrentSessionId,
    toggleFavorite,
  };
};