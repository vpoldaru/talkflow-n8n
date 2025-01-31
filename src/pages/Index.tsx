import { useState, useRef, useEffect } from "react";
import { Message, ChatSession } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n.martinclan.org/webhook/0949763f-f3f7-46bf-8676-c050d92e6966/chat";
const STORAGE_KEY = "chat_sessions";

const Index = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getCurrentSession = () => {
    return sessions.find(s => s.id === currentSessionId);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInput("");
  };

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [getCurrentSession()?.messages]);

  const updateSession = (sessionId: string, messages: Message[]) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages, lastUpdated: Date.now() }
        : session
    ));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !WEBHOOK_URL) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    const currentSession = getCurrentSession();
    if (!currentSession) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      role: "user",
      timestamp: Date.now(),
    };

    const newMessages = [...currentSession.messages, userMessage];
    updateSession(currentSession.id, newMessages);
    setInput("");
    setIsLoading(true);

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

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data[0]?.output || "Sorry, I couldn't process that.",
        role: "assistant",
        timestamp: Date.now(),
      };

      updateSession(currentSession.id, [...newMessages, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFirstMessage = (messages: Message[]) => {
    const userMessage = messages.find(m => m.role === "user");
    return userMessage ? userMessage.content : "New Chat";
  };

  const currentSession = getCurrentSession();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50/50 flex flex-col">
        <div className="p-4 border-b">
          <Button onClick={createNewSession} className="w-full flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setCurrentSessionId(session.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors",
                  "flex items-center gap-2 text-sm",
                  session.id === currentSessionId && "bg-gray-100"
                )}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <div className="truncate flex-1">
                  <div className="font-medium truncate">
                    {getFirstMessage(session.messages)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(session.lastUpdated, 'MMM d, h:mm a')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentSession?.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;