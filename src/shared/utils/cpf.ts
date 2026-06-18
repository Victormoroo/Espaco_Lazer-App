/** Remove tudo que não for dígito de uma string. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata progressivamente um CPF no padrão 000.000.000-00.
 * Limita a 11 dígitos e adiciona pontos/traço conforme o usuário digita.
 */
export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length > 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  if (digits.length > 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  return digits;
}
