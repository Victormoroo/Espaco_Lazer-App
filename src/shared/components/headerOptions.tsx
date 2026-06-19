import React from 'react';
import { AppColors } from '../constants/colors';
import { ProfileButton } from './ProfileButton';

/**
 * Opções de header (native-stack) compartilhadas pelas seções autenticadas,
 * para que a navbar (cores, título e ícone de perfil) fique idêntica em todas.
 * O botão de menu (hambúrguer) é adicionado por tela via `headerLeft`.
 */
export const appHeaderScreenOptions = {
  headerStyle: { backgroundColor: AppColors.darkBlue },
  headerTintColor: AppColors.white,
  headerTitleStyle: { fontWeight: '800' as const },
  headerRight: () => <ProfileButton />,
  contentStyle: { backgroundColor: AppColors.lightGray },
};
