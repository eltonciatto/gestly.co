import { createContext, useContext, useEffect, useState } from 'react';
import { createAuth } from '@gestly/auth';
import type { User, Session } from '@gestly/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = createAuth({
  jwtSecret: import.meta.env.VITE_JWT_SECRET
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      setSession(parsedSession);
      setUser(parsedSession.user);
    }
    setIsLoading(false);
  }, []);

  // Auto refresh session
  useEffect(() => {
    if (!session?.refreshToken) return;

    const refreshInterval = setInterval(async () => {
      await refreshSession();
    }, 15 * 60 * 1000); // Every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [session?.refreshToken]);

  const signIn = async (email: string, password: string) => {
    const { user, session, error } = await auth.signIn(email, password);
    
    if (error) throw error;
    
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
      setSession(session);
      setUser(user);
    }
  };

  const signOut = async () => {
    if (session) {
      await auth.signOut(session);
    }
    localStorage.removeItem('session');
    setSession(null);
    setUser(null);
  };

  const refreshSession = async () => {
    if (!session?.refreshToken) return;

    const { session: newSession, error } = await auth.refreshSession(session.refreshToken);
    
    if (error || !newSession) {
      // If refresh fails, sign out
      await signOut();
      return;
    }

    localStorage.setItem('session', JSON.stringify(newSession));
    setSession(newSession);
    setUser(newSession.user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signIn,
      signOut,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}