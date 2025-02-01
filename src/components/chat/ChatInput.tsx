import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Loader2, Send, Mic } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSend,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(e);
    }
  };

  return (
    <form onSubmit={onSend} className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center items-center">
      <div className="w-full max-w-[900px] px-4 py-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Textarea
              placeholder="Type a message..."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={textareaRef}
              rows={1}
              className="min-h-[44px] w-full resize-none bg-background px-4 py-3 focus-visible:ring-1"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="button" 
            size="icon" 
            variant="ghost"
            className="shrink-0"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};