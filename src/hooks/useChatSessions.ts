import { useState, useEffect } from "react";
import { Message, ChatSession } from "@/types/chat";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_WELCOME_MESSAGE } from "@/config/messages";

const STORAGE_KEY = "chat_sessions";

// Add detailed logging for configuration sources
console.log('Configuration Sources:');
console.log('window.env:', window.env);
console.log('import.meta.env:', import.meta.env);
console.log('DEFAULT_WELCOME_MESSAGE:', DEFAULT_WELCOME_MESSAGE);

const WEBHOOK_URL = (() => {
  const windowEnvUrl = window.env?.VITE_N8N_WEBHOOK_URL;
  const viteEnvUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const fallbackUrl = "https://n8n.martinclan.org/webhook/0949763f-f3f7-46bf-8676-c050d92e6966/chat";
  
  console.log('WEBHOOK_URL sources:');
  console.log('- window.env.VITE_N8N_WEBHOOK_URL:', windowEnvUrl);
  console.log('- import.meta.env.VITE_N8N_WEBHOOK_URL:', viteEnvUrl);
  console.log('- fallback URL:', fallbackUrl);
  
  const finalUrl = windowEnvUrl || viteEnvUrl || fallbackUrl;
  console.log('Selected WEBHOOK_URL:', finalUrl);
  return finalUrl;
})();

const WELCOME_MESSAGE = (() => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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

  const updateSession = (sessionId: string, messages: Message[]) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages, lastUpdated: Date.now() }
        : session
    ));
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

  const sendMessage = async (input: string) => {
    const currentSession = getCurrentSession();
    if (!currentSession || !input.trim() || !WEBHOOK_URL) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      role: "user",
      timestamp: Date.now(),
    };

    const newMessages = [...currentSession.messages, userMessage];
    updateSession(currentSession.id, newMessages);
    
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          chatInput: input,
          sessionId: currentSession.id 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: uuidv4(),
        content: data[0]?.output || "Sorry, I couldn't process that.",
        role: "assistant",
        timestamp: Date.now(),
      };

      updateSession(currentSession.id, [...newMessages, assistantMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return {
    sessions,
    currentSessionId,
    isLoading,
    isTyping,
    getCurrentSession,
    createNewSession,
    deleteSession,
    sendMessage,
    setCurrentSessionId,
  };
};
