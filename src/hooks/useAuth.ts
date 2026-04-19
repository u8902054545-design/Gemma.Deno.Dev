import { useEffect, useState } from 'react';
import { supabase } from '../config';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    setUser(null);
    await supabase.auth.signOut();
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

      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

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
        console.error(err);
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuth(session);
    });

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
      console.error(error);
    }
  };

  return { user, loading, signInWithGoogle, signOut };
};
