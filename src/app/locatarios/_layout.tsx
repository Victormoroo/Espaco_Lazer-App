import { Stack } from 'expo-router';
import { AppColors } from '../../shared/constants/colors';

export default function LocatariosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: AppColors.darkBlue },
        headerTintColor: AppColors.white,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: AppColors.lightGray },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Locatários' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo locatário' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="[id]/editar" options={{ title: 'Editar locatário' }} />
    </Stack>
  );
}
