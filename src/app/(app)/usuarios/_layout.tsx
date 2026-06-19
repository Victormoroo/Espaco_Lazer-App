import React from 'react';
import { Stack } from 'expo-router';
import { appHeaderScreenOptions } from '../../../shared/components/headerOptions';
import { BackButton } from '../../../shared/components/BackButton';

/** Área de gestão de usuários (admin). Aberta via push, com botão de voltar. */
export default function UsuariosLayout() {
  return (
    <Stack screenOptions={appHeaderScreenOptions}>
      <Stack.Screen
        name="novo"
        options={{ title: 'Novo usuário', headerLeft: () => <BackButton /> }}
      />
    </Stack>
  );
}
