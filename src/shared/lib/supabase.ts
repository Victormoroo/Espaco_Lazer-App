// Polyfill obrigatório para o supabase-js funcionar no React Native.
// Deve ser importado ANTES de criar o client.
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * Client do Supabase — preparado para uso futuro (Auth, PostgreSQL, Storage,
 * Edge Functions). Nesta primeira etapa ele NÃO é usado por nenhuma tela:
 * o login ainda é validado localmente (ver src/features/auth/services).
 *
 * 👉 Preencha os dois valores abaixo com os dados do seu projeto:
 *    Painel do Supabase → Project Settings → API
 *      - Project URL  → supabaseUrl
 *      - anon public  → supabaseAnonKey
 */
const supabaseUrl = 'COLE_AQUI_A_URL_DO_SUPABASE';
const supabaseAnonKey = 'COLE_AQUI_A_ANON_KEY_DO_SUPABASE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
