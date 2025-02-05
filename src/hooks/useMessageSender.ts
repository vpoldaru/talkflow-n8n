import { useState } from 'react';
import { Message } from '@/types/chat';
import { fetchWithTimeout, FETCH_TIMEOUT } from '@/utils/fetchWithTimeout';
import { extractResponseContent } from '@/utils/responseHandler';
import { QueryClient } from '@tanstack/react-query';
import { handleApiResponse, handleApiError } from '@/utils/apiResponseHandler';
import { prepareFileData } from '@/utils/fileOperations';
import { toast } from "sonner";

export const useMessageSender = (
  updateSession: (sessionId: string, messages: Message[]) => void,
  queryClient: QueryClient
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (
    input: string,
    sessionId: string,
    currentMessages: Message[],
    file?: File
  ) => {
    const effectiveWebhookUrl = window.env?.VITE_N8N_WEBHOOK_URL || import.meta.env.VITE_N8N_WEBHOOK_URL;
    const username = window.env?.VITE_N8N_WEBHOOK_USERNAME || import.meta.env.VITE_N8N_WEBHOOK_USERNAME;
    const secret = window.env?.VITE_N8N_WEBHOOK_SECRET || import.meta.env.VITE_N8N_WEBHOOK_SECRET;

    if (!effectiveWebhookUrl) {
      toast.error("Configuration error: No webhook URL available");
      return;
    }

    try {
      setIsLoading(true);
      setIsTyping(true);

      const fileData = file ? await prepareFileData(file) : null;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: input,
        role: "user",
        timestamp: Date.now(),
        ...(fileData && { imageData: fileData })
      };

      const newMessages = [...currentMessages, userMessage];
      updateSession(sessionId, newMessages);
      queryClient.setQueryData(['chatSessions', sessionId], newMessages);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (username && secret) {
        const authString = `${username}:${secret}`;
        const base64Auth = btoa(authString);
        headers['Authorization'] = `Basic ${base64Auth}`;
      }

      console.log('Sending message to webhook:', {
        url: effectiveWebhookUrl,
        hasAuth: !!username && !!secret,
        hasFile: !!file
      });

      const response = await fetchWithTimeout(
        effectiveWebhookUrl,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            chatInput: input,
            sessionId: sessionId,
            ...(fileData && {
              data: fileData.data,
              mimeType: fileData.mimeType,
              fileName: fileData.fileName
            })
          }),
        },
        FETCH_TIMEOUT
      );

      const responseData = await handleApiResponse(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!responseData) {
        throw new Error('Empty response from server');
      }

      const responseContent = extractResponseContent(responseData);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: responseContent,
        role: "assistant",
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      updateSession(sessionId, finalMessages);
      queryClient.setQueryData(['chatSessions', sessionId], finalMessages);
      
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error in webhook request:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    isTyping
  };
};