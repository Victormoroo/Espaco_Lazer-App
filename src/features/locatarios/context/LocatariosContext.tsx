import React, { createContext, useContext, useMemo, useState } from 'react';
import { Locatario, LocatarioInput } from '../types';
import {
  adicionarLocatario,
  atualizarLocatario,
  removerLocatario,
} from '../state/locatariosReducer';
import { onlyDigits } from '../../../shared/utils/cpf';

type LocatariosContextValue = {
  locatarios: Locatario[];
  adicionar: (input: LocatarioInput) => Locatario;
  atualizar: (id: string, input: LocatarioInput) => void;
  remover: (id: string) => void;
  obter: (id: string) => Locatario | undefined;
};

const LocatariosContext = createContext<LocatariosContextValue | null>(null);

function gerarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

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

export function LocatariosProvider({ children }: { children: React.ReactNode }) {
  const [locatarios, setLocatarios] = useState<Locatario[]>([]);

  const value = useMemo<LocatariosContextValue>(
    () => ({
      locatarios,
      adicionar: (input) => {
        const novo: Locatario = {
          ...normalizar(input),
          id: gerarId(),
          criadoEm: new Date().toISOString(),
        };
        setLocatarios((lista) => adicionarLocatario(lista, novo));
        return novo;
      },
      atualizar: (id, input) =>
        setLocatarios((lista) => atualizarLocatario(lista, id, normalizar(input))),
      remover: (id) => setLocatarios((lista) => removerLocatario(lista, id)),
      obter: (id) => locatarios.find((l) => l.id === id),
    }),
    [locatarios],
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
