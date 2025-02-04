import { useState } from 'react';
import { useToast } from './use-toast';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { QueryClient } from '@tanstack/react-query';

export const useMessageSender = (
  webhook_url: string,
  updateSession: (sessionId: string, messages: Message[]) => void,
  queryClient: QueryClient
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (
    input: string,
    sessionId: string,
    currentMessages: Message[],
    file?: File
  ) => {
    const effectiveWebhookUrl = window.env?.VITE_N8N_WEBHOOK_URL || webhook_url;

    if (!effectiveWebhookUrl) {
      console.error('No webhook URL provided');
      toast({
        description: "Configuration error: No webhook URL available",
        variant: "destructive",
      });
      return;
    }

    console.log('useMessageSender sendMessage called with:', {
      input,
      sessionId,
      hasFile: !!file,
      fileDetails: file ? {
        name: file.name,
        size: file.size,
        type: file.type
      } : null
    });

    setIsLoading(true);
    setIsTyping(true);

    let imageData;
    if (file) {
      try {
        const base64Data = await fileToBase64(file);
        imageData = {
          data: base64Data,
          mimeType: file.type,
          fileName: file.name
        };
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          description: "Error processing image file",
          variant: "destructive",
        });
        setIsLoading(false);
        setIsTyping(false);
        return;
      }
    }

    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      role: "user",
      timestamp: Date.now(),
      ...(imageData && { imageData })
    };

    const newMessages = [...currentMessages, userMessage];
    updateSession(sessionId, newMessages);
    
    queryClient.setQueryData(['chatSessions', sessionId], newMessages);

    const controller = new AbortController();
    const signal = controller.signal;

    // Set timeout to 10 minutes
    const timeoutId = setTimeout(() => controller.abort(), 600000);

    try {
      const response = await fetch(effectiveWebhookUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: input,
          sessionId: sessionId,
          ...(file && {
            data: await fileToBase64(file),
            mimeType: file.type,
            fileName: file.name
          })
        }),
        signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseContent = extractResponseContent(data);

      const assistantMessage: Message = {
        id: uuidv4(),
        content: responseContent,
        role: "assistant",
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      updateSession(sessionId, finalMessages);
      
      queryClient.setQueryData(['chatSessions', sessionId], finalMessages);
      
      console.log('Message sent successfully');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in webhook request:', error);
        toast({
          description: "Error sending message",
          variant: "destructive",
        });
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
      setIsTyping(false);
    }

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  };

  return {
    sendMessage,
    isLoading,
    isTyping
  };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

const extractResponseContent = (data: any): string => {
  if (typeof data === 'string') return data;
  
  if (Array.isArray(data)) {
    const firstItem = data[0];
    if (!firstItem) return "No response content available";
    
    if (typeof firstItem === 'string') return firstItem;
    
    if (typeof firstItem === 'object') {
      if (firstItem.message?.content && firstItem.message?.role === 'assistant') {
        return firstItem.message.content;
      }
      
      const possibleContent = firstItem.message?.content || 
                            firstItem.content ||
                            firstItem.output ||
                            firstItem.text ||
                            firstItem.response;
                            
      if (possibleContent) return possibleContent;
      
      try {
        return JSON.stringify(firstItem);
      } catch (e) {
        console.warn('Failed to stringify response:', e);
        return "Unable to process response format";
      }
    }
  }
  
  if (typeof data === 'object') {
    if (data.message?.content && data.message?.role === 'assistant') {
      return data.message.content;
    }
    
    const possibleContent = data.message?.content || 
                          data.content ||
                          data.output ||
                          data.text ||
                          data.response;
                          
    if (possibleContent) return possibleContent;
    
    try {
      return JSON.stringify(data);
    } catch (e) {
      console.warn('Failed to stringify response:', e);
      return "Unable to process response format";
    }
  }
  
  return "Unexpected response format";
};