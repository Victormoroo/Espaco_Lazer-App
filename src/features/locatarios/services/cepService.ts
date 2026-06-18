import { onlyDigits } from '../../../shared/utils/cep';

export type EnderecoCep = {
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
};

type ViaCepResposta = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

/**
 * Busca o endereço de um CEP na API pública ViaCEP.
 * Retorna `null` se o CEP não tiver 8 dígitos, não existir, ou em erro de rede.
 */
export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoCep | null> {
  const digitos = onlyDigits(cep);
  if (digitos.length !== 8) return null;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
    if (!resposta.ok) return null;

    const dados: ViaCepResposta = await resposta.json();
    if (dados.erro) return null;

    return {
      logradouro: dados.logradouro || undefined,
      bairro: dados.bairro || undefined,
      cidade: dados.localidade || undefined,
      uf: dados.uf || undefined,
    };
  } catch {
    return null;
  }
}
