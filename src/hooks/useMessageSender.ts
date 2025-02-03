import { useState } from 'react';
import { useToast } from './use-toast';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export const useMessageSender = (
  webhook_url: string,
  updateSession: (sessionId: string, messages: Message[]) => void
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
    if (!webhook_url) {
      console.error('No webhook URL provided');
      toast({
        description: "Configuration error: No webhook URL",
        variant: "destructive",
      });
      return;
    }

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

    try {
      const response = await fetch(webhook_url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: input,
          sessionId: sessionId,
          ...(imageData && {
            data: imageData.data,
            mimeType: imageData.mimeType,
            fileName: imageData.fileName
          })
        })
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

      updateSession(sessionId, [...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error in webhook request:', error);
      toast({
        description: "Error sending message",
        variant: "destructive",
      });
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