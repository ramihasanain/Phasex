import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string, marketContext: string) => {
    if (!text.trim()) return;

    // Build chat history string from existing messages
    const historyContext = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

    // Add user message to UI
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Safely pulling the API key from environment variables
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!API_KEY) {
        throw new Error("API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
      }
      
      const fullPrompt = `
You are an expert financial AI assistant integrated into "Phase X Trading Platform". 
Your job is to cleanly analyze market data and give precise, professional, and directly useful insights.

### Strict Rules:
1. You MUST ONLY discuss and answer questions related to the specific asset provided in the Market Context below. Do not provide analysis for any other currency or asset.
2. Answer in the same language the user asks the question in (Arabic or English).
3. If the user asks about the current state, use EXACTLY the data provided in the Market Context. Do NOT hallucinate data.
4. Mention "Phase X State", "Displacement", "Oscillation", etc., if they are relevant.
5. Be concise and format the response beautifully utilizing markdown bullet points.

### Chat History
${historyContext}

### Market Context (Live Data from API for current Asset)
${marketContext}

### User Prompt
${text}
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch AI response');
      }

      // Extract the text from Gemini response format
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

      // Add AI response to UI
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resultText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'An unexpected error occurred');
      
      // Optionally add an error message to the chat
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
