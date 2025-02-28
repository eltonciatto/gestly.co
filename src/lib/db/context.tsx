import { createContext, useContext, useEffect, useState } from 'react';
import { getDB } from './index';
import type { User, Session } from './types';
import { AppError } from '../error';

interface DatabaseContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
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

    // Subscribe to auth changes
    const db = getDB();
    const unsubscribe = db.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem('session', JSON.stringify(session));
        setSession(session);
        setUser(session.user);
      } else {
        localStorage.removeItem('session');
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithMagicLink = async (email: string) => {
    try {
      const db = getDB();
      const { session, error } = await db.auth.signIn(email);
      
      if (error) throw error;
      
      if (session) {
        localStorage.setItem('session', JSON.stringify(session));
        setSession(session);
        setUser(session.user);
      }
    } catch (error) {
      throw new AppError('Failed to send magic link', 'auth_error');
    }
  };

  const signOut = async () => {
    try {
      const db = getDB();
      await db.auth.signOut();
      localStorage.removeItem('session');
      setSession(null);
      setUser(null);
    } catch (error) {
      throw new AppError('Failed to sign out', 'auth_error');
    }
  };

  return (
    <DatabaseContext.Provider value={{
      user,
      session,
      isLoading,
      signInWithMagicLink,
      signOut
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}