import { Stack } from 'expo-router';
import { appHeaderScreenOptions } from '../../../shared/components/headerOptions';
import { DrawerMenuButton } from '../../../shared/components/DrawerMenuButton';

/**
 * Stack das telas de locatários, aninhada no Drawer. A lista mostra o botão de
 * menu (hambúrguer, idêntico ao da Início); as subtelas usam o "voltar".
 */
export default function LocatariosLayout() {
  return (
    <Stack screenOptions={appHeaderScreenOptions}>
      <Stack.Screen
        name="index"
        options={{ title: 'Locatários', headerLeft: () => <DrawerMenuButton /> }}
      />
      <Stack.Screen name="novo" options={{ title: 'Novo locatário' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="[id]/editar" options={{ title: 'Editar locatário' }} />
    </Stack>
  );
}
