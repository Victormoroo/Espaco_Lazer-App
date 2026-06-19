import { supabase } from '../../../shared/lib/supabase';
import { Locatario, LocatarioInput } from '../types';

const TABELA = 'locatarios';
const COLUNAS =
  'id, nome, cpf, telefone, email, cep, logradouro, numero, complemento, bairro, cidade, uf, observacoes, criado_em';

type LinhaDB = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  observacoes: string | null;
  criado_em: string;
};

/** Linha do banco (snake_case, nulos) -> Locatario (camelCase, opcionais). */
function paraLocatario(linha: LinhaDB): Locatario {
  return {
    id: linha.id,
    nome: linha.nome,
    cpf: linha.cpf,
    telefone: linha.telefone,
    email: linha.email ?? undefined,
    cep: linha.cep ?? undefined,
    logradouro: linha.logradouro ?? undefined,
    numero: linha.numero ?? undefined,
    complemento: linha.complemento ?? undefined,
    bairro: linha.bairro ?? undefined,
    cidade: linha.cidade ?? undefined,
    uf: linha.uf ?? undefined,
    observacoes: linha.observacoes ?? undefined,
    criadoEm: linha.criado_em,
  };
}

/** Input do app -> colunas para insert/update (opcionais vazios viram null). */
function paraColunas(input: LocatarioInput) {
  return {
    nome: input.nome,
    cpf: input.cpf,
    telefone: input.telefone,
    email: input.email ?? null,
    cep: input.cep ?? null,
    logradouro: input.logradouro ?? null,
    numero: input.numero ?? null,
    complemento: input.complemento ?? null,
    bairro: input.bairro ?? null,
    cidade: input.cidade ?? null,
    uf: input.uf ?? null,
    observacoes: input.observacoes ?? null,
  };
}

export async function listarLocatarios(): Promise<Locatario[]> {
  const { data, error } = await supabase.from(TABELA).select(COLUNAS).order('nome');
  if (error) throw new Error(error.message);
  return (data as LinhaDB[]).map(paraLocatario);
}

export async function inserirLocatario(input: LocatarioInput): Promise<Locatario> {
  const { data, error } = await supabase
    .from(TABELA)
    .insert(paraColunas(input))
    .select(COLUNAS)
    .single();
  if (error) throw new Error(error.message);
  return paraLocatario(data as LinhaDB);
}

export async function atualizarLocatarioDb(id: string, input: LocatarioInput): Promise<void> {
  const { error } = await supabase.from(TABELA).update(paraColunas(input)).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function removerLocatarioDb(id: string): Promise<void> {
  const { error } = await supabase.from(TABELA).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
