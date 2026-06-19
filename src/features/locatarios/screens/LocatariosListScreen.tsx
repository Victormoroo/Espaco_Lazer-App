import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocatarios } from '../context/LocatariosContext';
import { LocatarioListItem } from '../components/LocatarioListItem';
import { AppColors } from '../../../shared/constants/colors';
import { onlyDigits } from '../../../shared/utils/cpf';

export function LocatariosListScreen() {
  const router = useRouter();
  const { locatarios } = useLocatarios();
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return locatarios;
    const digitos = onlyDigits(busca);
    return locatarios.filter(
      (l) =>
        l.nome.toLowerCase().includes(termo) ||
        (digitos.length > 0 && l.cpf.includes(digitos)),
    );
  }, [busca, locatarios]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color={AppColors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou CPF"
          placeholderTextColor={AppColors.textMuted}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LocatarioListItem
            locatario={item}
            onPress={() => router.push(`/locatarios/${item.id}`)}
          />
        )}
        contentContainerStyle={
          filtrados.length === 0
            ? styles.emptyContent
            : [styles.listContent, { paddingBottom: insets.bottom + 88 }]
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={AppColors.border} />
            <Text style={styles.emptyText}>
              {locatarios.length === 0
                ? 'Nenhum locatário cadastrado.'
                : 'Nenhum resultado para a busca.'}
            </Text>
            {locatarios.length === 0 ? (
              <Text style={styles.emptyHint}>Toque em + para adicionar.</Text>
            ) : null}
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => router.push('/locatarios/novo')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Adicionar locatário"
      >
        <Ionicons name="add" size={28} color={AppColors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.lightGray },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 14,
    height: 48,
    margin: 16,
    marginBottom: 4,
  },
  searchInput: { flex: 1, fontSize: 15, color: AppColors.darkBlue },
  listContent: { padding: 16 },
  emptyContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  empty: { alignItems: 'center' },
  emptyText: { marginTop: 12, fontSize: 15, color: AppColors.textMuted, textAlign: 'center' },
  emptyHint: { marginTop: 4, fontSize: 13, color: AppColors.textMuted },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.darkBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
});
