import { supabase } from '../../../shared/lib/supabase';
import { onlyDigits } from '../../../shared/utils/cpf';

/** Domínio do e-mail sintético usado para autenticar por CPF. */
const DOMINIO = 'espacolazer.app';

/** Converte um CPF no e-mail sintético usado no Supabase Auth. */
export function cpfParaEmail(cpf: string): string {
  return `${onlyDigits(cpf)}@${DOMINIO}`;
}

/** Faz login no Supabase Auth usando CPF + senha. Lança erro amigável. */
export async function entrar(cpf: string, senha: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: cpfParaEmail(cpf),
    password: senha,
  });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('invalid')) {
      throw new Error('CPF ou senha incorretos.');
    }
    throw new Error('Não foi possível entrar. Verifique sua conexão e tente novamente.');
  }
}

/** Encerra a sessão atual. */
export async function sair(): Promise<void> {
  await supabase.auth.signOut();
}
