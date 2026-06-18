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

/** Valida um CPF pelo dígito verificador (rejeita sequências repetidas). */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split('').map((c) => parseInt(c, 10));
  const calcular = (qtd: number): number => {
    let soma = 0;
    for (let i = 0; i < qtd; i++) {
      soma += digits[i] * (qtd + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return calcular(9) === digits[9] && calcular(10) === digits[10];
}
