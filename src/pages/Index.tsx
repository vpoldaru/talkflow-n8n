import { useState, useRef, useEffect } from "react";
import { Message, WebhookConfig } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { WebhookConfigDialog } from "@/components/WebhookConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Settings } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({ url: "" });
  const [showConfig, setShowConfig] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !webhookConfig.url) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(webhookConfig.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: input,
          sessionId: sessionId 
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      
      // Update sessionId if it's in the response
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "Sorry, I couldn't process that.",
        role: "assistant",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please check your webhook configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowConfig(true)}
          className="ml-2"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {showConfig && (
        <div className="mb-4">
          <WebhookConfigDialog
            config={webhookConfig}
            onSave={(config) => {
              setWebhookConfig(config);
              setShowConfig(false);
              toast({
                title: "Success",
                description: "Webhook configuration saved",
              });
            }}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading || !webhookConfig.url}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !webhookConfig.url}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default Index;