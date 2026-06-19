// Edge Function: cria um usuário (somente admin pode chamar).
// Usa a service_role key (disponível só no servidor) para criar o usuário no
// Auth e gravar o papel na tabela `usuarios`. O chamador precisa estar logado
// e ter papel 'admin'.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function onlyDigits(s: unknown): string {
  return String(s ?? '').replace(/\D/g, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization') ?? '';

    // 1. Identifica quem chamou (pelo JWT do app).
    const caller = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await caller.auth.getUser();
    if (userErr || !userData.user) return json({ ok: false, error: 'Não autenticado.' });

    // 2. Confere se é admin.
    const { data: perfil } = await caller
      .from('usuarios')
      .select('papel')
      .eq('id', userData.user.id)
      .single();
    if (perfil?.papel !== 'admin') {
      return json({ ok: false, error: 'Apenas o admin pode criar usuários.' });
    }

    // 3. Valida a entrada.
    const body = await req.json().catch(() => ({}));
    const cpf = onlyDigits(body.cpf);
    const nome = String(body.nome ?? '').trim();
    const senha = String(body.senha ?? '');
    const papel = body.papel === 'admin' ? 'admin' : 'comum';

    if (cpf.length !== 11) return json({ ok: false, error: 'CPF inválido.' });
    if (!nome) return json({ ok: false, error: 'Informe o nome.' });
    if (senha.length < 6) return json({ ok: false, error: 'A senha deve ter ao menos 6 caracteres.' });

    // 4. Cria o usuário no Auth (já confirmado).
    const admin = createClient(url, service);
    const { data: novo, error: createErr } = await admin.auth.admin.createUser({
      email: `${cpf}@espacolazer.app`,
      password: senha,
      email_confirm: true,
      user_metadata: { cpf, nome },
    });
    if (createErr || !novo.user) {
      const m = (createErr?.message ?? '').toLowerCase();
      if (m.includes('already') || m.includes('registered')) {
        return json({ ok: false, error: 'Já existe um usuário com este CPF.' });
      }
      return json({ ok: false, error: createErr?.message ?? 'Falha ao criar usuário.' });
    }

    // 5. Grava o papel na tabela usuarios (rollback do Auth se falhar).
    const { error: insErr } = await admin
      .from('usuarios')
      .insert({ id: novo.user.id, cpf, nome, papel });
    if (insErr) {
      await admin.auth.admin.deleteUser(novo.user.id);
      const m = insErr.message.toLowerCase();
      if (m.includes('duplicate') || m.includes('unique')) {
        return json({ ok: false, error: 'Já existe um usuário com este CPF.' });
      }
      return json({ ok: false, error: insErr.message });
    }

    return json({ ok: true, id: novo.user.id });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : 'Erro inesperado.' });
  }
});
