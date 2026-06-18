import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppColors } from '../shared/constants/colors';

/**
 * Layout raiz da navegação (Expo Router).
 * Stack sem header — cada tela desenha sua própria AppBar/identidade.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: AppColors.lightGray },
        }}
      />
    </SafeAreaProvider>
  );
}
