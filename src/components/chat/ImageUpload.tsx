import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

interface ImageUploadProps {
  onImageSelect: (base64Image: string) => void;
  disabled?: boolean;
}

export const ImageUpload = ({ onImageSelect, disabled }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
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
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-white hover:bg-[#2A2F3C]"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </>
  );
};