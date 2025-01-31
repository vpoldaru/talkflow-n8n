import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSend }: ChatInputProps) => {
  return (
    <form onSubmit={onSend} className="p-4 border-t">
      <div className="flex gap-2 max-w-3xl mx-auto">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 min-h-[80px] resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend(e);
            }
          }}
        />
        <Button type="submit" disabled={isLoading} className="self-end">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send"
          )}
        </Button>
      </div>
    </form>
  );
};