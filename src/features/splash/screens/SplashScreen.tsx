import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppLogo } from '../../../shared/components/AppLogo';
import { AppColors } from '../../../shared/constants/colors';
import { AppStrings } from '../../../shared/constants/strings';

const SPLASH_DURATION_MS = 2000;

/**
 * Tela de carregamento inicial. Mostra a identidade visual por ~2s e então
 * redireciona para o login com `replace` (a splash não fica no histórico).
 *
 * 🔜 Evolução: aqui é o lugar natural para, no futuro, verificar uma sessão
 * Supabase e decidir entre `/login` e `/home`.
 */
export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScreenContainer center>
      <View style={styles.logoBlock}>
        <AppLogo variant="logoEmpilhada" size="lg" />
        <Text style={styles.phrase}>{AppStrings.appPhrase}</Text>
      </View>

      <View style={styles.loader}>
        <ActivityIndicator size="large" color={AppColors.turquoise} />
        <Text style={styles.loadingText}>Carregando…</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoBlock: { alignItems: 'center' },
  phrase: {
    marginTop: 18,
    maxWidth: 260,
    textAlign: 'center',
    color: AppColors.textMuted,
    fontSize: 14,
  },
  loader: { marginTop: 48, alignItems: 'center' },
  loadingText: { marginTop: 10, color: AppColors.textMuted, fontSize: 13 },
});
