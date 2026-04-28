import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api-client";
import type { ApiUser } from "@/types/api";

interface AuthContextType {
  user: ApiUser | null;
  session: { accessToken: string } | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { access } = api.getTokens();
    if (access) {
      api.get<ApiUser>('/api/auth/me')
        .then(setUser)
        .catch(() => api.clearTokens())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post<any>('/api/auth/login', { email, password });
      api.setTokens(data.accessToken, data.refreshToken);
      setUser(data.user as ApiUser);
      return { error: null };
    } catch (e: any) {
      return { error: new Error(e.message) };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const data = await api.post<any>('/api/auth/register', { email, password });
      api.setTokens(data.accessToken, data.refreshToken);
      setUser(data.user as ApiUser);
      return { error: null };
    } catch (e: any) {
      return { error: new Error(e.message) };
    }
  };

  const signOut = async () => {
    try {
      await api.post('/api/auth/logout', {});
    } catch {
      /* ignore */
    }
    api.clearTokens();
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, session: user ? { accessToken: '' } : null, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}