// Polyfill obrigatório para o supabase-js funcionar no React Native.
// Deve ser importado ANTES de criar o client.
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * Client do Supabase. URL e chave (publishable/anon) vêm do `.env.local`
 * (variáveis EXPO_PUBLIC_*, embutidas no bundle). A chave publishable é pública
 * por design — o que protege os dados é o RLS configurado na tabela.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase não configurado: defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_KEY no .env.local e reinicie com `npx expo start -c`.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
