import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppInput } from '../../../shared/components/AppInput';
import { AppButton } from '../../../shared/components/AppButton';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf } from '../../../shared/utils/cpf';
import { formatTelefone } from '../../../shared/utils/telefone';
import { useLocatarios } from '../context/LocatariosContext';
import { validarLocatario, ErrosLocatario } from '../validation/locatarioValidation';
import { LocatarioInput } from '../types';

type Props = { id?: string };

const VAZIO: LocatarioInput = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: '',
  observacoes: '',
};

export function LocatarioFormScreen({ id }: Props) {
  const router = useRouter();
  const { locatarios, obter, adicionar, atualizar } = useLocatarios();
  const existente = id ? obter(id) : undefined;

  const [form, setForm] = useState<LocatarioInput>(() =>
    existente
      ? {
          nome: existente.nome,
          cpf: formatCpf(existente.cpf),
          telefone: formatTelefone(existente.telefone),
          email: existente.email ?? '',
          endereco: existente.endereco ?? '',
          observacoes: existente.observacoes ?? '',
        }
      : VAZIO,
  );
  const [erros, setErros] = useState<ErrosLocatario>({});

  function set<K extends keyof LocatarioInput>(campo: K, valor: LocatarioInput[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function salvar() {
    const validacao = validarLocatario(form, locatarios, id);
    setErros(validacao);
    if (Object.keys(validacao).length > 0) return;

    if (id) {
      atualizar(id, form);
    } else {
      adicionar(form);
    }
    router.back();
  }

  return (
    <ScreenContainer scroll>
      <AppInput
        label="Nome completo"
        value={form.nome}
        onChangeText={(t) => set('nome', t)}
        placeholder="Nome do locatário"
      />
      {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}

      <AppInput
        label="CPF"
        value={form.cpf}
        onChangeText={(t) => set('cpf', formatCpf(t))}
        placeholder="000.000.000-00"
        keyboardType="number-pad"
        maxLength={14}
      />
      {erros.cpf ? <Text style={styles.erro}>{erros.cpf}</Text> : null}

      <AppInput
        label="Telefone / WhatsApp"
        value={form.telefone}
        onChangeText={(t) => set('telefone', formatTelefone(t))}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
        maxLength={16}
      />
      {erros.telefone ? <Text style={styles.erro}>{erros.telefone}</Text> : null}

      <AppInput
        label="E-mail (opcional)"
        value={form.email}
        onChangeText={(t) => set('email', t)}
        placeholder="email@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}

      <AppInput
        label="Endereço (opcional)"
        value={form.endereco}
        onChangeText={(t) => set('endereco', t)}
        placeholder="Rua, número, bairro, cidade"
        multiline
      />

      <AppInput
        label="Observações (opcional)"
        value={form.observacoes}
        onChangeText={(t) => set('observacoes', t)}
        placeholder="Anotações sobre o locatário"
        multiline
      />

      <AppButton
        label={id ? 'Salvar alterações' : 'Adicionar locatário'}
        onPress={salvar}
        style={styles.botao}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  erro: { color: AppColors.error, fontSize: 13, marginTop: -8, marginBottom: 12 },
  botao: { marginTop: 8, marginBottom: 24 },
});
