import { Locatario, LocatarioInput } from '../types';

export function adicionarLocatario(lista: Locatario[], novo: Locatario): Locatario[] {
  return [...lista, novo];
}

export function atualizarLocatario(
  lista: Locatario[],
  id: string,
  input: LocatarioInput,
): Locatario[] {
  return lista.map((l) => (l.id === id ? { ...l, ...input } : l));
}

export function removerLocatario(lista: Locatario[], id: string): Locatario[] {
  return lista.filter((l) => l.id !== id);
}
