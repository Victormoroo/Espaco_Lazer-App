import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Locatario } from '../types';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf } from '../../../shared/utils/cpf';
import { formatTelefone } from '../../../shared/utils/telefone';

type Props = { locatario: Locatario; onPress: () => void };

export function LocatarioListItem({ locatario, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={styles.nome}>{locatario.nome}</Text>
        <Text style={styles.detalhe}>
          {formatCpf(locatario.cpf)} · {formatTelefone(locatario.telefone)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={AppColors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  info: { flex: 1 },
  nome: { fontSize: 16, fontWeight: '700', color: AppColors.darkBlue },
  detalhe: { fontSize: 13, color: AppColors.textMuted, marginTop: 2 },
});
