import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppInput } from '../../../shared/components/AppInput';
import { AppButton } from '../../../shared/components/AppButton';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf } from '../../../shared/utils/cpf';
import { formatTelefone } from '../../../shared/utils/telefone';
import { formatCep, onlyDigits } from '../../../shared/utils/cep';
import { capitalizarPalavras } from '../../../shared/utils/texto';
import { buscarEnderecoPorCep } from '../services/cepService';
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
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);
  const [numeroErro, setNumeroErro] = useState(false);
  const [salvando, setSalvando] = useState(false);

  function set<K extends keyof LocatarioInput>(campo: K, valor: LocatarioInput[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function onChangeNumero(texto: string) {
    setNumeroErro(/\D/.test(texto));
    set('numero', onlyDigits(texto).slice(0, 5));
  }

  async function buscarCep(digitos: string) {
    setBuscandoCep(true);
    setCepNaoEncontrado(false);
    const endereco = await buscarEnderecoPorCep(digitos);
    setBuscandoCep(false);
    if (!endereco) {
      setCepNaoEncontrado(true);
      return;
    }
    setForm((f) => ({
      ...f,
      logradouro: endereco.logradouro ?? f.logradouro,
      bairro: endereco.bairro ?? f.bairro,
      cidade: endereco.cidade ?? f.cidade,
      uf: endereco.uf ?? f.uf,
    }));
  }

  function onChangeCep(texto: string) {
    const mascarado = formatCep(texto);
    set('cep', mascarado);
    setCepNaoEncontrado(false);
    if (onlyDigits(mascarado).length === 8) {
      void buscarCep(onlyDigits(mascarado));
    }
  }

  async function salvar() {
    const validacao = validarLocatario(form, locatarios, id);
    setErros(validacao);
    if (Object.keys(validacao).length > 0) return;

    setSalvando(true);
    try {
      if (id) {
        await atualizar(id, form);
      } else {
        await adicionar(form);
      }
      if (router.canGoBack()) router.back();
      else router.replace('/locatarios');
    } catch (e) {
      setSalvando(false);
      Alert.alert('Erro ao salvar', e instanceof Error ? e.message : 'Tente novamente.');
    }
  }

  return (
    <ScreenContainer scroll edges={['bottom']}>
      <AppInput
        label="Nome completo"
        value={form.nome}
        onChangeText={(t) => set('nome', capitalizarPalavras(t))}
        placeholder="Nome do locatário"
        autoCapitalize="words"
        maxLength={60}
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
        onChangeText={onChangeCep}
        placeholder="00000-000"
        keyboardType="number-pad"
        maxLength={9}
      />
      {buscandoCep ? (
        <Text style={styles.cepInfo}>Buscando endereço…</Text>
      ) : cepNaoEncontrado ? (
        <Text style={styles.cepErro}>CEP não encontrado — preencha manualmente.</Text>
      ) : null}

      <AppInput
        label="Logradouro"
        value={form.logradouro}
        onChangeText={(t) => set('logradouro', t)}
        placeholder="Rua, avenida..."
        maxLength={100}
      />

      <View style={styles.linha}>
        <View style={styles.colNumero}>
          <AppInput
            label="Número"
            value={form.numero}
            onChangeText={onChangeNumero}
            placeholder="123"
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>
        <View style={styles.colComplemento}>
          <AppInput
            label="Complemento"
            value={form.complemento}
            onChangeText={(t) => set('complemento', t)}
            placeholder="Apto, bloco..."
            maxLength={50}
          />
        </View>
      </View>
      {numeroErro ? (
        <Text style={styles.erro}>Número deve conter apenas dígitos.</Text>
      ) : null}

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
            maxLength={50}
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
        maxLength={200}
      />

      <AppButton
        label={id ? 'Salvar alterações' : 'Adicionar locatário'}
        onPress={salvar}
        loading={salvando}
        style={styles.botao}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  erro: { color: AppColors.error, fontSize: 13, marginTop: -8, marginBottom: 12 },
  cepInfo: { color: AppColors.textMuted, fontSize: 12, marginTop: -8, marginBottom: 12 },
  cepErro: { color: AppColors.error, fontSize: 12, marginTop: -8, marginBottom: 12 },
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
