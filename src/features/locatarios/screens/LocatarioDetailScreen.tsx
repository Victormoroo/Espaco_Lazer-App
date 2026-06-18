import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppButton } from '../../../shared/components/AppButton';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf } from '../../../shared/utils/cpf';
import { formatTelefone } from '../../../shared/utils/telefone';
import { formatCep } from '../../../shared/utils/cep';
import { useLocatarios } from '../context/LocatariosContext';
import { Locatario } from '../types';

type Props = { id: string };

function formatarData(iso: string): string {
  const partes = iso.slice(0, 10).split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : iso;
}

/** Monta o endereço em texto legível a partir dos campos; undefined se vazio. */
function formatarEndereco(loc: Locatario): string | undefined {
  const ruaNumero = [loc.logradouro, loc.numero].filter(Boolean).join(', ');
  const linha1 = [ruaNumero, loc.complemento].filter(Boolean).join(' - ');
  const cidadeUf = [loc.cidade, loc.uf].filter(Boolean).join('/');
  const linha2 = [loc.bairro, cidadeUf].filter(Boolean).join(' - ');
  const linha3 = loc.cep ? `CEP ${formatCep(loc.cep)}` : '';
  const partes = [linha1, linha2, linha3].filter((p) => p.length > 0);
  return partes.length > 0 ? partes.join('\n') : undefined;
}

function Linha({ rotulo, valor }: { rotulo: string; valor?: string }) {
  if (!valor) return null;
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

export function LocatarioDetailScreen({ id }: Props) {
  const router = useRouter();
  const { obter, remover } = useLocatarios();
  const locatario = obter(id);

  if (!locatario) {
    return (
      <ScreenContainer center edges={['bottom']}>
        <Text style={styles.naoEncontrado}>Locatário não encontrado.</Text>
      </ScreenContainer>
    );
  }

  const loc = locatario;

  function excluir() {
    Alert.alert(
      'Excluir locatário',
      `Remover "${loc.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            remover(loc.id);
            if (router.canGoBack()) router.back();
            else router.replace('/locatarios');
          },
        },
      ],
    );
  }

  return (
    <ScreenContainer scroll edges={['bottom']}>
      <View style={styles.card}>
        <Text style={styles.nome}>{loc.nome}</Text>
        <View style={styles.divisor} />
        <Linha rotulo="CPF" valor={formatCpf(loc.cpf)} />
        <Linha rotulo="Telefone" valor={formatTelefone(loc.telefone)} />
        <Linha rotulo="E-mail" valor={loc.email} />
        <Linha rotulo="Endereço" valor={formatarEndereco(loc)} />
        <Linha rotulo="Observações" valor={loc.observacoes} />
        <Linha rotulo="Cadastrado em" valor={formatarData(loc.criadoEm)} />
      </View>

      <AppButton
        label="Editar"
        onPress={() => router.push(`/locatarios/${loc.id}/editar`)}
        style={styles.botao}
      />
      <AppButton label="Excluir" onPress={excluir} style={styles.botaoExcluir} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
  },
  nome: { fontSize: 20, fontWeight: '800', color: AppColors.darkBlue },
  divisor: { height: 1, backgroundColor: AppColors.border, marginVertical: 14 },
  linha: { marginBottom: 12 },
  rotulo: { fontSize: 12, color: AppColors.textMuted, fontWeight: '600' },
  valor: { fontSize: 15, color: AppColors.darkBlue, marginTop: 2 },
  botao: { marginTop: 16 },
  botaoExcluir: { marginTop: 12, backgroundColor: AppColors.error },
  naoEncontrado: { fontSize: 15, color: AppColors.textMuted },
});
