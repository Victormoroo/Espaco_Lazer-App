import { Stack } from 'expo-router';
import { appHeaderScreenOptions } from '../../../shared/components/headerOptions';
import { DrawerMenuButton } from '../../../shared/components/DrawerMenuButton';
import { AppStrings } from '../../../shared/constants/strings';

export default function InicioLayout() {
  return (
    <Stack screenOptions={appHeaderScreenOptions}>
      <Stack.Screen
        name="index"
        options={{ title: AppStrings.appName, headerLeft: () => <DrawerMenuButton /> }}
      />
    </Stack>
  );
}
