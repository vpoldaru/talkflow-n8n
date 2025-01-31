import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { WebhookConfig } from "@/types/chat";

interface WebhookConfigProps {
  config: WebhookConfig;
  onSave: (config: WebhookConfig) => void;
}

export const WebhookConfigDialog = ({ config, onSave }: WebhookConfigProps) => {
  const [url, setUrl] = useState(config.url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ url });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <label htmlFor="webhook-url" className="text-sm font-medium">
          n8n Webhook URL
        </label>
        <Input
          id="webhook-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-n8n-instance/webhook/..."
          className="w-full"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Save Configuration
      </Button>
    </form>
  );
};