import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { User, Session } from './types';
import { useToast } from '@/components/ui/use-toast';
import { AppError } from '../error';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const signIn = async (email: string) => {
    try {
      setIsLoading(true);
      const name = email.split('@')[0];
      await sendMagicLink(email, name);
      
      toast({
        title: 'Link enviado!',
        description: 'Verifique seu email para fazer login.',
      });
    } catch (error) {
      const message = error instanceof AppError 
        ? error.message 
        : 'Não foi possível enviar o link de acesso. Tente novamente mais tarde.';

      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await apiClient.auth.logout();
      localStorage.removeItem('session');
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error in signOut:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: 'Tente novamente mais tarde'
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signIn,
      signOut
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