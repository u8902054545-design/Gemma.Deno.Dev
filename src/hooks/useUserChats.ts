import { useEffect, useState, useCallback } from 'react';
import { supabase, SUPABASE_ENDPOINT } from '../config';

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

export const useUserChats = (userId: string | undefined) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setChats(data || []);
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const deleteChatLocally = async (chatId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Unauthorized');

      const response = await fetch(SUPABASE_ENDPOINT, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ chat_id: chatId }),
      });

      if (!response.ok) throw new Error('Failed to delete chat');
      setChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (err) {
      console.error('Error deleting chat:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, loading, refreshChats: fetchChats, deleteChat: deleteChatLocally };
};
