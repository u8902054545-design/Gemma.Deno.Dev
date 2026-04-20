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
  const [chatId, setChatId] = useState(() => crypto.randomUUID());
  const [chatTitle, setChatTitle] = useState('');

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: number;

    if (messages.length > 0 && !chatTitle) {
      const fetchTitle = async () => {
        const { data } = await supabase
          .from('chats')
          .select('title')
          .eq('id', chatId)
          .maybeSingle();

        if (data?.title) {
          setChatTitle(data.title);
          if (interval) clearInterval(interval);
        }
      };

      interval = setInterval(fetchTitle, 3000);
      fetchTitle();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [chatId, messages.length, chatTitle]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setMessages([]);
        setInput('');
        setIsTyping(false);
        setChatId(crypto.randomUUID());
        setChatTitle('');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSend = useCallback(async (overrideInput?: string) => {
    const textToSend = typeof overrideInput === 'string' ? overrideInput : input;

    if (!textToSend.trim() || isTyping) return;

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setSnackbarMessage('Ошибка авторизации. Попробуй перезайти в аккаунт.');
      setIsSnackbarOpen(true);
      return;
    }

    const userText = textToSend.trim();
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    const aiMsgId = (Date.now() + 1).toString();
    const newAiMsg: Message = { id: aiMsgId, role: 'ai', content: '' };
    setMessages(prev => [...prev, newAiMsg]);

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
          chat_id: chatId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (!reader) throw new Error('ReadableStream not supported');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, content: accumulatedContent } : msg
          )
        );
      }

    } catch (error: any) {
      setMessages(prev => prev.filter(msg => msg.id !== aiMsgId));
      setSnackbarMessage(error.message);
      setIsSnackbarOpen(true);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, selectedModel, chatId]);

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
    chatTitle,
    models: MODELS,
    snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen
  };
};
