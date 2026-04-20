import { useEffect, useState } from 'react';
import { supabase } from '../config'; // Теперь путь точно правильный

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

export const useUserChats = (userId: string | undefined) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    if (!userId) return;
    
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
  };

  useEffect(() => {
    fetchChats();
  }, [userId]);

  return { chats, loading, refreshChats: fetchChats };
};
