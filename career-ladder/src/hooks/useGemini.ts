import { useState } from 'react';

interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseGeminiReturn {
  messages: GeminiMessage[];
  isLoading: boolean;
  error: string | null;
  ask: (messages: GeminiMessage[]) => Promise<string>;
  clearMessages: () => void;
}

export function useGemini(): UseGeminiReturn {
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (newMessages: GeminiMessage[]): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const reply = data.reply || 'No response received';
      
      // Update messages state with the conversation
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
      
      return reply;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    ask,
    clearMessages,
  };
}
