import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { AppLogo } from './AppLogo';
import { AppColors } from '../constants/colors';

/**
 * Conteúdo do menu lateral (Drawer): logo horizontal no topo, um separador
 * minimalista (linha fininha com acento dourado central) e, abaixo, os itens
 * de navegação padrão.
 */
export function DrawerConteudo(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <AppLogo variant="logoHorizontal" size="md" />
      </View>

      <View style={styles.separador}>
        <View style={styles.separadorLinha} />
        <View style={styles.separadorAcento} />
      </View>

      <View style={styles.itens}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 0 },
  header: {
    paddingTop: 55,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  separador: {
    height: 18,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separadorLinha: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.border,
  },
  separadorAcento: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: AppColors.gold,
  },
  itens: { paddingTop: 4 },
});
