import { useState } from 'react';
import { useToast } from './use-toast';
import { createFormDataWithFile } from '@/utils/fileUpload';
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
    if (!input.trim() || !webhook_url) return;

    let userMessage: Message = {
      id: uuidv4(),
      content: input,
      role: "user",
      timestamp: Date.now(),
    };

    // If there's a file, process it and add it to the message
    if (file) {
      try {
        const formData = await createFormDataWithFile(input, sessionId, file);
        const base64Data = formData.get('data') as string;
        const mimeType = formData.get('mimeType') as string;
        const fileName = formData.get('fileName') as string;

        userMessage = {
          ...userMessage,
          imageData: {
            data: base64Data,
            mimeType: mimeType,
            fileName: fileName
          }
        };

        // Log the data being sent
        console.log('Sending data to webhook:', {
          chatInput: input,
          sessionId: sessionId,
          data: base64Data,
          mimeType: mimeType,
          fileName: fileName
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          description: "Error processing image file",
          variant: "destructive",
        });
        return;
      }
    }

    const newMessages = [...currentMessages, userMessage];
    updateSession(sessionId, newMessages);
    
    setIsLoading(true);
    setIsTyping(true);

    try {
      const payload = {
        chatInput: input,
        sessionId: sessionId,
        ...(userMessage.imageData && {
          data: userMessage.imageData.data,
          mimeType: userMessage.imageData.mimeType,
          fileName: userMessage.imageData.fileName
        })
      };

      console.log('Sending request to webhook URL:', webhook_url);
      const response = await fetch(webhook_url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: uuidv4(),
        content: data[0]?.output || "Sorry, I couldn't process that.",
        role: "assistant",
        timestamp: Date.now(),
      };

      updateSession(sessionId, [...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: "Sorry, there was an error processing your message. Please try again later.",
        role: "assistant",
        timestamp: Date.now(),
      };
      updateSession(sessionId, [...newMessages, errorMessage]);
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