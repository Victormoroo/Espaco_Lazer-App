import { supabase } from '../../../shared/lib/supabase';

export type Papel = 'admin' | 'comum';

export type NovoUsuario = {
  cpf: string;
  nome: string;
  senha: string;
  papel: Papel;
};

/**
 * Cria um usuário via Edge Function `criar-usuario` (que valida se o chamador é
 * admin e usa a service_role no servidor). Lança erro amigável em caso de falha.
 */
export async function criarUsuario(input: NovoUsuario): Promise<void> {
  const { data, error } = await supabase.functions.invoke('criar-usuario', {
    body: input,
  });

  if (error) {
    throw new Error(
      'Não foi possível criar o usuário. Verifique sua conexão e tente novamente.',
    );
  }
  if (!data?.ok) {
    throw new Error(data?.error ?? 'Não foi possível criar o usuário.');
  }
}
