import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors } from '../constants/colors';

/** Botão de voltar para headers de telas abertas via push (ex.: criar usuário). */
export function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={styles.botao}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
    >
      <Ionicons name="arrow-back" size={24} color={AppColors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: { paddingHorizontal: 16, paddingVertical: 4 },
});
