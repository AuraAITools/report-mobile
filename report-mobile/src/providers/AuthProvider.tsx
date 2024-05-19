import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js'
import { AppState } from 'react-native';
import { Href, useRouter } from 'expo-router';

type AuthData = {
  session: Session | null;
  loading: Boolean;
}

// initial context
const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
});

// whenever screen becomes active, exchange AT & RT for a new pair
AppState.addEventListener('change', (state) => {
  console.log(`event: ${state} fired`)

  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<Boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // register listener on AuthProvider mount to listen to state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`auth event: ${event}`);
      setSession(session);
      setLoading(false);

      if (event === "SIGNED_IN") {
        router.replace(`/(authenticated)/(accounts)/${session?.user.id}` as Href<String>);
      }
      else if (event === 'SIGNED_OUT') {
        router.replace('/')
      }

    });

    // clean up auth listener on AuthProvider dismount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [])

  return <AuthContext.Provider value={{ session, loading}}>{children}</AuthContext.Provider>;
}

// custom hook to provide our auth context
export const useAuth = () => useContext(AuthContext);