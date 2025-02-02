import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Loader2, Send, Mic, X } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  onImageSelect?: (file: File) => void;
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
  const [previewImage, setPreviewImage] = useState<{ file: File; url: string } | null>(null);
  const { isListening, startListening } = useSpeechRecognition({
    onTranscript: (transcript) => onInputChange(input + transcript)
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend(e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && input.trim()) {
      if (previewImage && onImageSelect) {
        onImageSelect(previewImage.file);
      }
      onSend(e);
      setPreviewImage(null);
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

      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage({ file, url: imageUrl });
  };

  const clearPreviewImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage.url);
      setPreviewImage(null);
    }
  };

  const isInputEmpty = input.length === 0 || !input.trim();

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[900px] mx-auto px-4">
        {previewImage && (
          <div className="relative inline-block mb-2">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <img
                src={previewImage.url}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={clearPreviewImage}
                className="absolute top-0 right-0 p-1 bg-black/50 rounded-bl hover:bg-black/70"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        )}
        <div className="relative py-4">
          <Textarea
            placeholder="Type a message or paste an image..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            ref={textareaRef}
            rows={3}
            className="min-h-[24px] w-full resize-none bg-[#1A1F2C] text-white rounded-xl pr-24 pl-12 py-3 focus-visible:ring-1 border-none"
            disabled={isLoading}
            style={{
              height: 'auto',
              minHeight: '80px',
              maxHeight: '200px'
            }}
          />
          <div className="absolute left-2 bottom-2.5">
            {onImageSelect && (
              <ImageUpload 
                onImageSelect={handleImageSelection}
                disabled={isLoading}
              />
            )}
          </div>
          <div className="absolute right-2 bottom-2.5 flex items-center gap-2">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-[#2A2F3C]"
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