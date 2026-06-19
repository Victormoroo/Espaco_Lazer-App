import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppLogo } from '../../../shared/components/AppLogo';
import { AppColors } from '../../../shared/constants/colors';
import { AppStrings } from '../../../shared/constants/strings';

/** Tela de carregamento exibida enquanto a sessão é verificada (ver app/index). */
export function SplashScreen() {
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
