import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../features/auth/context/AuthContext';
import { LocatariosProvider } from '../../features/locatarios/context/LocatariosContext';
import { ProfileMenuProvider } from '../../shared/components/ProfileMenu';
import { DrawerConteudo } from '../../shared/components/DrawerConteudo';
import { AppColors } from '../../shared/constants/colors';

/**
 * Área autenticada: protegida por sessão. Sem sessão, redireciona ao login.
 * O LocatariosProvider vive aqui (só busca dados quando há sessão).
 */
export default function AppLayout() {
  const { carregando, sessao } = useAuth();

  if (carregando) return null;
  if (!sessao) return <Redirect href="/login" />;

  return (
    <LocatariosProvider>
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
          <Drawer.Screen
            name="locatarios"
            options={{ drawerLabel: 'Locatários', title: 'Locatários' }}
          />
          {/* Acessada via menu de perfil (admin); não aparece no drawer. */}
          <Drawer.Screen name="usuarios" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
      </ProfileMenuProvider>
    </LocatariosProvider>
  );
}
