import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Locatario, LocatarioInput } from '../types';
import { onlyDigits } from '../../../shared/utils/cpf';
import {
  adicionarLocatario,
  atualizarLocatario,
  removerLocatario,
} from '../state/locatariosReducer';
import {
  listarLocatarios,
  inserirLocatario,
  atualizarLocatarioDb,
  removerLocatarioDb,
} from '../services/locatariosService';

type LocatariosContextValue = {
  locatarios: Locatario[];
  carregando: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
  adicionar: (input: LocatarioInput) => Promise<void>;
  atualizar: (id: string, input: LocatarioInput) => Promise<void>;
  remover: (id: string) => Promise<void>;
  obter: (id: string) => Locatario | undefined;
};

const LocatariosContext = createContext<LocatariosContextValue | null>(null);

function normalizar(input: LocatarioInput): LocatarioInput {
  return {
    nome: input.nome.trim(),
    cpf: onlyDigits(input.cpf),
    telefone: onlyDigits(input.telefone),
    email: input.email?.trim() || undefined,
    cep: onlyDigits(input.cep ?? '') || undefined,
    logradouro: input.logradouro?.trim() || undefined,
    numero: input.numero?.trim() || undefined,
    complemento: input.complemento?.trim() || undefined,
    bairro: input.bairro?.trim() || undefined,
    cidade: input.cidade?.trim() || undefined,
    uf: input.uf?.trim().toUpperCase() || undefined,
    observacoes: input.observacoes?.trim() || undefined,
  };
}

function ordenar(lista: Locatario[]): Locatario[] {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome));
}

/**
 * Estado dos locatários, persistido no Supabase. Mantém um cache local em
 * memória sincronizado: carrega ao montar e atualiza após cada operação.
 */
export function LocatariosProvider({ children }: { children: React.ReactNode }) {
  const [locatarios, setLocatarios] = useState<Locatario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setLocatarios(ordenar(await listarLocatarios()));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao carregar locatários.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  const value = useMemo<LocatariosContextValue>(
    () => ({
      locatarios,
      carregando,
      erro,
      recarregar,
      adicionar: async (input) => {
        const novo = await inserirLocatario(normalizar(input));
        setLocatarios((lista) => ordenar(adicionarLocatario(lista, novo)));
      },
      atualizar: async (id, input) => {
        const norm = normalizar(input);
        await atualizarLocatarioDb(id, norm);
        setLocatarios((lista) => ordenar(atualizarLocatario(lista, id, norm)));
      },
      remover: async (id) => {
        await removerLocatarioDb(id);
        setLocatarios((lista) => removerLocatario(lista, id));
      },
      obter: (id) => locatarios.find((l) => l.id === id),
    }),
    [locatarios, carregando, erro, recarregar],
  );

  return <LocatariosContext.Provider value={value}>{children}</LocatariosContext.Provider>;
}

export function useLocatarios(): LocatariosContextValue {
  const ctx = useContext(LocatariosContext);
  if (!ctx) {
    throw new Error('useLocatarios deve ser usado dentro de <LocatariosProvider>.');
  }
  return ctx;
}
