import { supabase } from '../config';

export const handleNewChat = (setMessages: (m: any[]) => void, setChatId: (id: string) => void, setChatTitle: (t: string) => void) => {
  setMessages([]);
  setChatId(crypto.randomUUID());
  setChatTitle('');
};

export const deleteChat = async (chatId: string, onSuccess: () => void) => {
  try {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) throw error;
    onSuccess();
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
};

export const renameChat = async (chatId: string, newTitle: string, setChatTitle: (t: string) => void) => {
  try {
    const { error } = await supabase
      .from('chats')
      .update({ title: newTitle })
      .eq('id', chatId);

    if (error) throw error;
    setChatTitle(newTitle);
  } catch (error) {
    console.error('Error renaming chat:', error);
  }
};

export const downloadHistory = (messages: any[], format: 'txt' | 'json') => {
  let content = "";
  if (format === 'json') {
    content = JSON.stringify(messages, null, 2);
  } else {
    content = messages.map(m => `${m.role === 'user' ? 'Вы' : 'ИИ'}: ${m.content}`).join('\n\n');
  }
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-history.${format}`;
  a.click();
};
