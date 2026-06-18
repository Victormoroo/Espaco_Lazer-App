import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppInput } from '../../../shared/components/AppInput';
import { AppButton } from '../../../shared/components/AppButton';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf } from '../../../shared/utils/cpf';
import { formatTelefone } from '../../../shared/utils/telefone';
import { formatCep } from '../../../shared/utils/cep';
import { useLocatarios } from '../context/LocatariosContext';
import { validarLocatario, ErrosLocatario } from '../validation/locatarioValidation';
import { LocatarioInput } from '../types';

type Props = { id?: string };

const VAZIO: LocatarioInput = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
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
          cep: existente.cep ? formatCep(existente.cep) : '',
          logradouro: existente.logradouro ?? '',
          numero: existente.numero ?? '',
          complemento: existente.complemento ?? '',
          bairro: existente.bairro ?? '',
          cidade: existente.cidade ?? '',
          uf: existente.uf ?? '',
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
    if (router.canGoBack()) router.back();
    else router.replace('/locatarios');
  }

  return (
    <ScreenContainer scroll edges={['bottom']}>
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

      <Text style={styles.secao}>Endereço (opcional)</Text>

      <AppInput
        label="CEP"
        value={form.cep}
        onChangeText={(t) => set('cep', formatCep(t))}
        placeholder="00000-000"
        keyboardType="number-pad"
        maxLength={9}
      />

      <AppInput
        label="Logradouro"
        value={form.logradouro}
        onChangeText={(t) => set('logradouro', t)}
        placeholder="Rua, avenida..."
      />

      <View style={styles.linha}>
        <View style={styles.colNumero}>
          <AppInput
            label="Número"
            value={form.numero}
            onChangeText={(t) => set('numero', t)}
            placeholder="123"
          />
        </View>
        <View style={styles.colComplemento}>
          <AppInput
            label="Complemento"
            value={form.complemento}
            onChangeText={(t) => set('complemento', t)}
            placeholder="Apto, bloco..."
          />
        </View>
      </View>

      <AppInput
        label="Bairro"
        value={form.bairro}
        onChangeText={(t) => set('bairro', t)}
        placeholder="Bairro"
      />

      <View style={styles.linha}>
        <View style={styles.colCidade}>
          <AppInput
            label="Cidade"
            value={form.cidade}
            onChangeText={(t) => set('cidade', t)}
            placeholder="Cidade"
          />
        </View>
        <View style={styles.colUf}>
          <AppInput
            label="UF"
            value={form.uf}
            onChangeText={(t) => set('uf', t.toUpperCase())}
            placeholder="UF"
            autoCapitalize="characters"
            maxLength={2}
          />
        </View>
      </View>

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
  secao: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.darkBlue,
    marginTop: 4,
    marginBottom: 12,
  },
  linha: { flexDirection: 'row', gap: 12 },
  colNumero: { flex: 1 },
  colComplemento: { flex: 2 },
  colCidade: { flex: 2 },
  colUf: { flex: 1 },
  botao: { marginTop: 8, marginBottom: 24 },
});
