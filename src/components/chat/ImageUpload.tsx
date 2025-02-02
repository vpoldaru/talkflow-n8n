import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageSelect: (base64Image: string) => void;
  disabled?: boolean;
}

export const ImageUpload = ({ onImageSelect, disabled }: ImageUploadProps) => {
  const { toast } = useToast();

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-white hover:bg-[#2A2F3C]"
        disabled={disabled}
      >
        <Image className="h-4 w-4" />
      </Button>
    </div>
  );
};