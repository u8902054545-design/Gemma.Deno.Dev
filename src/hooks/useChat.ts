import { useState, useRef, useEffect, useCallback } from 'react';
import { SUPABASE_ENDPOINT, supabase } from '../config';

export type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

export const MODELS = [
  'Gemma 3 1B',
  'Gemma 3 4B',
  'Gemma 3 12B',
  'Gemma 3 27B',
  'Gemma 3n E2B',
  'Gemma 3n E4B',
  'Gemma 4 26B A4B IT',
  'Gemma 4 31B IT',
];

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(isTyping);
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(async (overrideInput?: string) => {
    const textToSend = typeof overrideInput === 'string' ? overrideInput : input;
    
    if (!textToSend.trim() || isTyping) return;

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setSnackbarMessage('Пожалуйста, войди в аккаунт через Google.');
      setIsSnackbarOpen(true);
      return;
    }

    const userText = textToSend.trim();
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(SUPABASE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: userText,
          model: selectedModel,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseData.error || 'Network error');
      }

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: responseData.content
      };

      setMessages(prev => [...prev, newAiMsg]);
    } catch (error: any) {
      const errorMessage = error.message.includes('Failed to fetch')
        ? 'Network error: Check your connection'
        : error.message;

      setSnackbarMessage(errorMessage);
      setIsSnackbarOpen(true);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, selectedModel]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    messages,
    input,
    setInput,
    selectedModel,
    setSelectedModel,
    isDropdownOpen,
    setIsDropdownOpen,
    isTyping,
    messagesEndRef,
    handleSend,
    handleKeyDown,
    models: MODELS,
    snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen
  };
};
