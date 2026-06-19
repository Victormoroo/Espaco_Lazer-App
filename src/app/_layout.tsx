import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppColors } from '../shared/constants/colors';
import { LocatariosProvider } from '../features/locatarios/context/LocatariosContext';

/**
 * Layout raiz da navegação (Expo Router).
 * Stack sem header — splash/login não têm navbar; a área autenticada (grupo
 * (app)) usa um Drawer com sua própria navbar.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <LocatariosProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: AppColors.lightGray },
            }}
          />
        </LocatariosProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
