import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { LargeSecureStore, supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js'
import { AppState } from 'react-native';

type AuthData = {
  session: Session | null;
  loading: Boolean
}

// initial context
const AuthContext = createContext<AuthData>({
  session: null,
  loading: true
});

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

  useEffect(() => {

    //have to do this closure to run async functions within useEffect
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);

      if (session) {
        // set tokens
      }

      setLoading(false);
    }
    fetchSession()
  }, [])

  return <AuthContext.Provider value={{session, loading}}>{children}</AuthContext.Provider>;
}

// custom hook to provide our auth context
export const useAuth = () => useContext(AuthContext);