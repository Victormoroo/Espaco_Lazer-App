import { Locatario, LocatarioInput } from '../types';
import { isValidCpf, onlyDigits } from '../../../shared/utils/cpf';

export type ErrosLocatario = Partial<Record<keyof LocatarioInput, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarLocatario(
  input: LocatarioInput,
  existentes: Locatario[],
  idAtual?: string,
): ErrosLocatario {
  const erros: ErrosLocatario = {};

  if (!input.nome.trim()) {
    erros.nome = 'Informe o nome.';
  }

  const cpf = onlyDigits(input.cpf);
  if (!cpf) {
    erros.cpf = 'Informe o CPF.';
  } else if (!isValidCpf(cpf)) {
    erros.cpf = 'CPF inválido.';
  } else if (existentes.some((l) => l.id !== idAtual && onlyDigits(l.cpf) === cpf)) {
    erros.cpf = 'Já existe um locatário com este CPF.';
  }

  const tel = onlyDigits(input.telefone);
  if (!tel) {
    erros.telefone = 'Informe o telefone.';
  } else if (tel.length < 10 || tel.length > 11) {
    erros.telefone = 'Telefone deve ter 10 ou 11 dígitos.';
  }

  const email = input.email?.trim();
  if (email && !EMAIL_REGEX.test(email)) {
    erros.email = 'E-mail inválido.';
  }

  return erros;
}
