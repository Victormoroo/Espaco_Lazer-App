import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../../shared/constants/colors';
import { AppStrings } from '../../../shared/constants/strings';

/**
 * Home provisória pós-login. Possui uma AppBar com o título e o botão "Sair".
 * As funcionalidades reais (reservas, calendário, locatários, pagamentos...)
 * serão adicionadas nas próximas etapas.
 */
export function HomeScreen() {
  const router = useRouter();

  function handleLogout() {
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>{AppStrings.appName}</Text>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Sair"
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.welcome}>Bem-vindo ao {AppStrings.appName}</Text>
          <View style={styles.divider} />
          <Text style={styles.secondary}>{AppStrings.appSubtitle}</Text>
          <Text style={styles.hint}>
            Esta é uma tela provisória. As funcionalidades de reservas, calendário,
            locatários, check-in/out, contratos e pagamentos chegam nas próximas etapas.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.lightGray },
  appBar: {
    backgroundColor: AppColors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  appBarTitle: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: AppColors.turquoise,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  logoutText: { color: AppColors.turquoise, fontWeight: '700', fontSize: 13 },
  body: { flex: 1, padding: 24, justifyContent: 'center' },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: AppColors.darkBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.darkBlue,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    width: 48,
    borderRadius: 2,
    backgroundColor: AppColors.gold,
    marginVertical: 16,
  },
  secondary: { fontSize: 15, color: AppColors.turquoise, fontWeight: '600' },
  hint: {
    fontSize: 13,
    color: AppColors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});
