import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../constants/colors';
import { useProfileMenu } from './ProfileMenu';

/**
 * Ícone de perfil da navbar (direita). Mede a própria posição na tela e abre o
 * popover de conta ancorado no centro/base do ícone.
 */
export function ProfileButton() {
  const { abrir } = useProfileMenu();
  const ref = useRef<View>(null);

  function onPress() {
    ref.current?.measureInWindow((x, y, width, height) => {
      abrir({ x: x + width / 2, y: y + height });
    });
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.botao}
      accessibilityRole="button"
      accessibilityLabel="Conta"
    >
      <View ref={ref} collapsable={false}>
        <Ionicons name="person-circle-outline" size={28} color={AppColors.white} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: { paddingHorizontal: 14, paddingVertical: 4 },
});
