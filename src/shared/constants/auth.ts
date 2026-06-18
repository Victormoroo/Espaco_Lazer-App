/**
 * Credenciais fixas para validação LOCAL e TEMPORÁRIA do login.
 *
 * ⚠️ Etapa inicial apenas. Na próxima fase isto será substituído por
 * autenticação real via Supabase (`supabase.auth.signInWithPassword`),
 * e este arquivo poderá ser removido.
 */
export const AuthConstants = {
  validCpf: '447.521.288-02',
  validPassword: 'admin',
} as const;
