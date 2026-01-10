import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { supabase } from '../config/supabase';
import { setIsAuthLoading, setSession } from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, session, isAuthLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        dispatch(setSession(currentSession));
        dispatch(setIsAuthLoading(false));
      })
      .catch(err => console.log('Supabase Auth error:', err));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      dispatch(setSession(currentSession));
      dispatch(setIsAuthLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const singInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const singUpWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    isAuthLoading,
    singInWithPassword,
    singUpWithPassword,
    signOut,
  };
}
