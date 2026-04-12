import { useState, useRef, useEffect } from 'react';
import { SUPABASE_ENDPOINT } from '../config';

// Определение типа сообщения
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
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Hello! I am Gemma. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Состояния для управления Snackbar (уведомлениями)
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(SUPABASE_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
          // Если ты добавишь авторизацию на фронтенд позже, 
          // токен нужно будет передавать здесь в Authorization
        },
        body: JSON.stringify({
          message: userText,
          model: selectedModel,
        }),
      });

      // Читаем тело ответа один раз, чтобы обработать и данные, и ошибки
      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Выбрасываем ошибку с текстом от сервера (например, "Доступ запрещен")
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: responseData.content || "No response received."
      };

      setMessages(prev => [...prev, newAiMsg]);
    } catch (error: any) {
      // Выводим текст ошибки в наш новый красивый Snackbar
      // Если это ошибка fetch (Network error), пишем понятный текст
      const errorMessage = error.message.includes('Failed to fetch') 
        ? 'Network error: Check your connection' 
        : error.message;

      setSnackbarMessage(errorMessage);
      setIsSnackbarOpen(true);
    } finally {
      setIsTyping(false);
    }
  };

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
    // Экспортируем состояния Snackbar для App.tsx
    snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen
  };
};
