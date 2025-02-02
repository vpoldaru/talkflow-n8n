import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Loader2, Send, Mic } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  onImageSelect?: (base64Image: string) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSend,
  onImageSelect,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { isListening, startListening } = useSpeechRecognition({
    onTranscript: (transcript) => onInputChange(input + transcript)
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(e);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    if (!onImageSelect) return;

    const items = e.clipboardData?.items;
    const imageItem = Array.from(items).find(item => item.type.indexOf('image') !== -1);

    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (onImageSelect) {
          onImageSelect(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isInputEmpty = input.length === 0 || !input.trim();

  return (
    <form onSubmit={onSend} className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[900px] mx-auto px-4 py-4">
        <div className="relative">
          <Textarea
            placeholder="Type a message or paste an image..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            ref={textareaRef}
            rows={1}
            className="min-h-[24px] w-full resize-none bg-background pr-24 pl-12 py-3 focus-visible:ring-1"
            disabled={isLoading}
          />
          <div className="absolute left-2 bottom-2.5">
            {onImageSelect && (
              <ImageUpload 
                onImageSelect={onImageSelect}
                disabled={isLoading}
              />
            )}
          </div>
          <div className="absolute right-2 bottom-2.5 flex items-center gap-2">
            <Button 
              type="button" 
              size="icon" 
              variant={isListening ? "default" : "ghost"}
              className="h-8 w-8"
              onClick={startListening}
              disabled={isLoading}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              size="icon"
              className="h-8 w-8"
              disabled={isLoading || isInputEmpty}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};