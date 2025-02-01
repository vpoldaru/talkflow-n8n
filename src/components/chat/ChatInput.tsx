import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

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
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        onInputChange(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Speech recognition failed. Please try again.');
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [onInputChange]);

  const toggleRecording = () => {
    if (!recognition.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognition.current.stop();
      setIsRecording(false);
    } else {
      recognition.current.start();
      setIsRecording(true);
      toast.info('Listening...');
    }
  };

  return (
    <form onSubmit={onSend} className="p-4 fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-2xl mx-auto flex gap-4">
        <div className="relative flex-1">
          <Textarea
            placeholder="Type a message..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            rows={3}
            className="min-h-[80px] w-full resize-none bg-background px-4 py-[10px] focus-visible:ring-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend(e);
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2 justify-end">
          <Button 
            type="button" 
            size="icon" 
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleRecording}
            className="flex-shrink-0"
          >
            <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
          </Button>
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
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