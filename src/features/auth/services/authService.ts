import { AuthConstants } from '../../../shared/constants/auth';
import { onlyDigits } from '../../../shared/utils/cpf';

export type LoginResult =
  | { success: true }
  | { success: false; message: string };

/**
 * Validação LOCAL e TEMPORÁRIA do login (CPF + senha fixos).
 *
 * O CPF é comparado apenas pelos dígitos, então tanto faz o usuário digitar
 * com ou sem máscara.
 *
 * 🔜 Evolução: quando a autenticação real via Supabase for implementada,
 * troque o corpo desta função por algo como:
 *
 *   const { error } = await supabase.auth.signInWithPassword({ email, password });
 *   return error ? { success: false, message: error.message } : { success: true };
 *
 * Mantendo o mesmo retorno (`LoginResult`), a tela de login não precisa mudar.
 */
export function validateLogin(cpf: string, password: string): LoginResult {
  const cleanCpf = cpf.trim();
  const cleanPassword = password.trim();

  if (!cleanCpf || !cleanPassword) {
    return { success: false, message: 'Informe o CPF e a senha.' };
  }

  const matchesCpf = onlyDigits(cleanCpf) === onlyDigits(AuthConstants.validCpf);
  const matchesPassword = cleanPassword === AuthConstants.validPassword;

  if (!matchesCpf || !matchesPassword) {
    return { success: false, message: 'CPF ou senha incorretos.' };
  }

  return { success: true };
}
