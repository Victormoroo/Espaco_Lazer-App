import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuCard } from '../../../shared/components/MenuCard';
import { AppColors } from '../../../shared/constants/colors';
import { AppStrings } from '../../../shared/constants/strings';

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
        <Text style={styles.hello}>Bem-vindo ao {AppStrings.appName}</Text>
        <Text style={styles.subtitle}>{AppStrings.appSubtitle}</Text>

        <View style={styles.grid}>
          <MenuCard
            title="Locatários"
            subtitle="Cadastro e contatos"
            icon="people-outline"
            onPress={() => router.push('/locatarios')}
          />
          <View style={styles.cardSpacer} />
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
  appBarTitle: { color: AppColors.white, fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: AppColors.turquoise,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  logoutText: { color: AppColors.turquoise, fontWeight: '700', fontSize: 13 },
  body: { flex: 1, padding: 24 },
  hello: { fontSize: 22, fontWeight: '800', color: AppColors.darkBlue },
  subtitle: { fontSize: 14, color: AppColors.turquoise, fontWeight: '600', marginTop: 4, marginBottom: 24 },
  grid: { flexDirection: 'row', gap: 16 },
  cardSpacer: { flex: 1 },
});
