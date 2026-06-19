import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AppColors } from '../constants/colors';

/**
 * Botão de menu (hambúrguer) da navbar. Usado tanto na tela Início (header do
 * Drawer) quanto na Stack de Locatários, para que fique idêntico nos dois
 * lugares. `DrawerActions.openDrawer()` abre o Drawer mesmo a partir de uma
 * Stack aninhada (a ação propaga até o Drawer pai).
 */
export function DrawerMenuButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={styles.botao}
      accessibilityRole="button"
      accessibilityLabel="Abrir menu"
    >
      <Ionicons name="menu" size={28} color={AppColors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: { paddingHorizontal: 16, paddingVertical: 4 },
});
