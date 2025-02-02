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

  const extractResponseContent = (data: any): string => {
    console.log('Extracting content from response:', data);
    
    // If data is a string, return it directly
    if (typeof data === 'string') return data;
    
    // If data is an array, process the first item
    if (Array.isArray(data)) {
      const firstItem = data[0];
      if (!firstItem) return "No response content available";
      
      // Handle different response formats
      if (typeof firstItem === 'string') return firstItem;
      
      // Handle object responses
      if (typeof firstItem === 'object') {
        // Check common response patterns
        const possibleContent = firstItem.message?.content || 
                              firstItem.content ||
                              firstItem.output ||
                              firstItem.text ||
                              firstItem.response;
                              
        if (possibleContent) return possibleContent;
        
        // If no standard fields found, try to stringify the object
        try {
          return JSON.stringify(firstItem);
        } catch (e) {
          console.warn('Failed to stringify response:', e);
          return "Unable to process response format";
        }
      }
    }
    
    // Handle single object response
    if (typeof data === 'object') {
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
    
    // Fallback
    return "Unexpected response format";
  };

  const sendMessage = async (
    input: string,
    sessionId: string,
    currentMessages: Message[],
    file?: File
  ) => {
    console.log('useMessageSender sendMessage called with:', {
      input,
      sessionId,
      hasFile: !!file,
      fileDetails: file ? {
        name: file.name,
        type: file.type,
        size: file.size
      } : null
    });

    if (!input.trim() || !webhook_url) return;

    let userMessage: Message = {
      id: uuidv4(),
      content: input,
      role: "user",
      timestamp: Date.now(),
    };

    if (file) {
      console.log('Processing file in useMessageSender:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      try {
        const formData = await createFormDataWithFile(input, sessionId, file);
        const base64Data = formData.get('data') as string;
        const mimeType = formData.get('mimeType') as string;
        const fileName = formData.get('fileName') as string;

        console.log('File data retrieved from FormData:', {
          hasBase64Data: !!base64Data,
          mimeType,
          fileName,
          base64Length: base64Data?.length
        });

        userMessage = {
          ...userMessage,
          imageData: {
            data: base64Data,
            mimeType: mimeType,
            fileName: fileName
          }
        };

        console.log('User message updated with image data:', {
          messageId: userMessage.id,
          hasImageData: !!userMessage.imageData,
          imageDataLength: userMessage.imageData?.data.length
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

      console.log('Preparing webhook request:', {
        url: webhook_url,
        payloadKeys: Object.keys(payload),
        hasImageData: !!userMessage.imageData,
        payloadSize: JSON.stringify(payload).length,
        imageDataPreview: userMessage.imageData ? `${userMessage.imageData.data.substring(0, 50)}...` : null
      });

      const response = await fetch(webhook_url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Webhook response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Webhook response data:', data);

      const responseContent = extractResponseContent(data);
      console.log('Extracted response content:', responseContent);

      const assistantMessage: Message = {
        id: uuidv4(),
        content: responseContent,
        role: "assistant",
        timestamp: Date.now(),
      };

      updateSession(sessionId, [...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error in webhook request:', error);
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