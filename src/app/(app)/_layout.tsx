import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { ProfileMenuProvider } from '../../shared/components/ProfileMenu';
import { DrawerConteudo } from '../../shared/components/DrawerConteudo';
import { AppColors } from '../../shared/constants/colors';

/**
 * Área autenticada: Drawer (menu hambúrguer). Cada seção (Início, Locatários)
 * tem sua própria Stack com a navbar — por isso o Drawer não mostra header
 * (headerShown: false), garantindo navbar idêntica entre as telas.
 */
export default function AppLayout() {
  return (
    <ProfileMenuProvider>
      <StatusBar style="light" />
      <Drawer
        drawerContent={(props) => <DrawerConteudo {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: AppColors.turquoise,
          drawerInactiveTintColor: AppColors.darkBlue,
          drawerActiveBackgroundColor: AppColors.lightGray,
        }}
      >
        <Drawer.Screen name="inicio" options={{ drawerLabel: 'Início', title: 'Início' }} />
        <Drawer.Screen name="locatarios" options={{ drawerLabel: 'Locatários', title: 'Locatários' }} />
      </Drawer>
    </ProfileMenuProvider>
  );
}
