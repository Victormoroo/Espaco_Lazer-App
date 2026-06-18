import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppColors } from '../shared/constants/colors';
import { LocatariosProvider } from '../features/locatarios/context/LocatariosContext';

export default function RootLayout() {
  return (
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
  );
}
