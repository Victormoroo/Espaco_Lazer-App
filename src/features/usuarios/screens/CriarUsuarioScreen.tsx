import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppInput } from '../../../shared/components/AppInput';
import { AppButton } from '../../../shared/components/AppButton';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf, isValidCpf } from '../../../shared/utils/cpf';
import { capitalizarPalavras } from '../../../shared/utils/texto';
import { useAuth } from '../../auth/context/AuthContext';
import { criarUsuario, type Papel } from '../services/usuariosService';

export function CriarUsuarioScreen() {
  const router = useRouter();
  const { ehAdmin } = useAuth();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState<Papel>('comum');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  if (!ehAdmin) {
    return (
      <ScreenContainer center edges={['bottom']}>
        <Text style={styles.restrito}>Acesso restrito ao administrador.</Text>
      </ScreenContainer>
    );
  }

  async function salvar() {
    setErro(null);
    if (!nome.trim()) {
      setErro('Informe o nome.');
      return;
    }
    if (!isValidCpf(cpf)) {
      setErro('CPF inválido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter ao menos 6 caracteres.');
      return;
    }

    setSalvando(true);
    try {
      await criarUsuario({ cpf, nome: nome.trim(), senha, papel });
      Alert.alert('Usuário criado', `${nome.trim()} já pode entrar com o CPF e a senha.`);
      router.back();
    } catch (e) {
      setSalvando(false);
      setErro(e instanceof Error ? e.message : 'Não foi possível criar o usuário.');
    }
  }

  return (
    <ScreenContainer scroll edges={['bottom']}>
      <AppInput
        label="Nome completo"
        value={nome}
        onChangeText={(t) => setNome(capitalizarPalavras(t))}
        placeholder="Nome do usuário"
        autoCapitalize="words"
        maxLength={60}
      />

      <AppInput
        label="CPF"
        value={cpf}
        onChangeText={(t) => setCpf(formatCpf(t))}
        placeholder="000.000.000-00"
        keyboardType="number-pad"
        maxLength={14}
        autoCapitalize="none"
      />

      <AppInput
        label="Senha (mín. 6 caracteres)"
        value={senha}
        onChangeText={setSenha}
        placeholder="Senha de acesso"
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={styles.label}>Papel</Text>
      <View style={styles.papelRow}>
        <PapelOpcao texto="Comum" ativo={papel === 'comum'} onPress={() => setPapel('comum')} />
        <PapelOpcao texto="Admin" ativo={papel === 'admin'} onPress={() => setPapel('admin')} />
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <AppButton label="Criar usuário" onPress={salvar} loading={salvando} style={styles.botao} />
    </ScreenContainer>
  );
}

function PapelOpcao({
  texto,
  ativo,
  onPress,
}: {
  texto: string;
  ativo: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.pill, ativo && styles.pillAtiva]}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
    >
      <Text style={[styles.pillTexto, ativo && styles.pillTextoAtivo]}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  restrito: { color: AppColors.textMuted, fontSize: 15, textAlign: 'center' },
  label: {
    color: AppColors.darkBlue,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  papelRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  pill: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillAtiva: { borderColor: AppColors.turquoise, backgroundColor: AppColors.turquoise },
  pillTexto: { fontSize: 15, fontWeight: '600', color: AppColors.darkBlue },
  pillTextoAtivo: { color: AppColors.white },
  erro: { color: AppColors.error, fontSize: 13, marginBottom: 12 },
  botao: { marginTop: 16 },
});
