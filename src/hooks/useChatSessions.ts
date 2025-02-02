import { useState, useEffect } from "react";
import { Message, ChatSession } from "@/types/chat";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_WELCOME_MESSAGE } from "@/config/messages";
import { useMessageSender } from "./useMessageSender";

const STORAGE_KEY = "chat_sessions";

// Add detailed logging for configuration sources
console.log('Configuration Sources:');
console.log('window.env:', window.env);
console.log('import.meta.env:', import.meta.env);
console.log('DEFAULT_WELCOME_MESSAGE:', DEFAULT_WELCOME_MESSAGE);

const WEBHOOK_URL = (() => {
  // For Lovable development environment
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_N8N_WEBHOOK_URL;
  }
  
  // For Docker production environment
  const windowEnvUrl = window.env?.VITE_N8N_WEBHOOK_URL;
  const viteEnvUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const fallbackUrl = "https://n8n.martinclan.org/webhook/b7950eca-f56e-4307-85bc-e2d69a19c332/chat";
  
  console.log('WEBHOOK_URL sources:');
  console.log('- window.env.VITE_N8N_WEBHOOK_URL:', windowEnvUrl);
  console.log('- import.meta.env.VITE_N8N_WEBHOOK_URL:', viteEnvUrl);
  console.log('- fallback URL:', fallbackUrl);
  
  const selectedUrl = windowEnvUrl || viteEnvUrl || fallbackUrl;
  
  console.log('Selected WEBHOOK_URL:', selectedUrl);
  return selectedUrl;
})();

const WELCOME_MESSAGE = (() => {
  // For Lovable development environment
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_WELCOME_MESSAGE || DEFAULT_WELCOME_MESSAGE;
  }
  
  // For Docker production environment
  const windowEnvMsg = window.env?.VITE_WELCOME_MESSAGE;
  const viteEnvMsg = import.meta.env.VITE_WELCOME_MESSAGE;
  
  console.log('WELCOME_MESSAGE sources:');
  console.log('- window.env.VITE_WELCOME_MESSAGE:', windowEnvMsg);
  console.log('- import.meta.env.VITE_WELCOME_MESSAGE:', viteEnvMsg);
  console.log('- DEFAULT_WELCOME_MESSAGE:', DEFAULT_WELCOME_MESSAGE);
  
  const finalMsg = windowEnvMsg || viteEnvMsg || DEFAULT_WELCOME_MESSAGE;
  console.log('Selected WELCOME_MESSAGE:', finalMsg);
  return finalMsg;
})();

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  const updateSession = (sessionId: string, messages: Message[]) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages, lastUpdated: Date.now() }
        : session
    ));
  };

  const { sendMessage: sendMessageToWebhook, isLoading, isTyping } = useMessageSender(
    WEBHOOK_URL,
    updateSession
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
    
    await sendMessageToWebhook(
      input,
      currentSession.id,
      currentSession.messages,
      file
    );
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
  };
};