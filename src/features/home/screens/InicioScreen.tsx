import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppColors } from '../../../shared/constants/colors';

/**
 * Tela inicial — vazia por enquanto. Futuramente será o dashboard com
 * informações úteis (reservas do dia, pendências, etc.).
 */
export function InicioScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.lightGray },
});
