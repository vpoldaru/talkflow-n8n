import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Loader2, Send, Mic, X } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent, file?: File) => void;
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
      if (!isLoading && (input.trim() || previewImage)) {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoading && (input.trim() || previewImage)) {
      let messageText = input.trim();
      
      // If there's an image but no text, set a default message
      if (previewImage && !messageText) {
        messageText = "See image for details";
      }

      console.log('ChatInput handleSubmit called with previewImage:', previewImage ? {
        fileName: previewImage.file.name,
        fileSize: previewImage.file.size,
        fileType: previewImage.file.type
      } : null);
      
      const currentFile = previewImage?.file;
      
      try {
        await onSend(e, currentFile);
        onInputChange("");
        
        if (previewImage) {
          URL.revokeObjectURL(previewImage.url);
          setPreviewImage(null);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          description: "Failed to send message",
          variant: "destructive",
        });
      }
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

      console.log('Image pasted:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file: File) => {
    console.log('handleImageSelection called with file:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage({ file, url: imageUrl });
    
    if (onImageSelect) {
      console.log('Calling onImageSelect with file:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      onImageSelect(file);
    }
  };

  const clearPreviewImage = () => {
    if (previewImage) {
      console.log('Clearing preview image:', previewImage.file.name);
      URL.revokeObjectURL(previewImage.url);
      setPreviewImage(null);
    }
  };

  const isInputEmpty = !input.trim() && !previewImage;

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
          <div className="absolute left-3 bottom-6">
            {onImageSelect && (
              <ImageUpload 
                onImageSelect={handleImageSelection}
                disabled={isLoading}
              />
            )}
          </div>
          <div className="absolute right-3 bottom-6 flex items-center gap-2">
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
