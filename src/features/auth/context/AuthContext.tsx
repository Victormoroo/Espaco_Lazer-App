import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../../shared/lib/supabase';
import { entrar as entrarServico, sair as sairServico } from '../services/authService';

type AuthContextValue = {
  sessao: Session | null;
  carregando: boolean;
  ehAdmin: boolean;
  entrar: (cpf: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Gerencia a sessão do Supabase Auth: carrega a sessão salva ao abrir, escuta
 * mudanças (login/logout) e busca o papel do usuário (admin/comum).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [papel, setPapel] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      setSessao(data.session);
      setCarregando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao);
    });
    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessao) {
      setPapel(null);
      return;
    }
    let ativo = true;
    supabase
      .from('usuarios')
      .select('papel')
      .eq('id', sessao.user.id)
      .single()
      .then(({ data }) => {
        if (ativo) setPapel(data?.papel ?? 'comum');
      });
    return () => {
      ativo = false;
    };
  }, [sessao]);

  const value = useMemo<AuthContextValue>(
    () => ({
      sessao,
      carregando,
      ehAdmin: papel === 'admin',
      entrar: entrarServico,
      sair: sairServico,
    }),
    [sessao, carregando, papel],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  }
  return ctx;
}
