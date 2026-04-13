import { useEffect, useState } from 'react';
import { supabase } from '../config';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    let profileSubscription: any = null;

    const setupRealtimeSubscription = (userId: string) => {
      if (profileSubscription) supabase.removeChannel(profileSubscription);

      profileSubscription = supabase
        .channel(`public:profiles:id=eq.${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            if (payload.new && payload.new.is_blocked === true) {
              signOut();
            }
          }
        )
        .subscribe();
    };

    const handleAuth = async (session: any) => {
      const currentUser = session?.user ?? null;

      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_blocked')
            .eq('id', currentUser.id)
            .maybeSingle();

          if (error) throw error;

          if (data?.is_blocked) {
            await signOut();
          } else {
            setUser(currentUser);
            setupRealtimeSubscription(currentUser.id);
          }
        } catch (err) {
          console.error("Ошибка проверки профиля:", err);
          setUser(currentUser); // Пускаем, если база недоступна, сервер всё равно заблокирует запрос
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // Проверка при старте
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuth(session);
    });

    // Слушатель событий
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuth(session);
    });

    return () => {
      authSub.unsubscribe();
      if (profileSubscription) supabase.removeChannel(profileSubscription);
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  return { user, loading, signInWithGoogle, signOut };
};
