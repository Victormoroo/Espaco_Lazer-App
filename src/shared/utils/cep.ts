import { onlyDigits } from './cpf';

export { onlyDigits };

/** Formata um CEP progressivamente: 00000-000 (máx. 8 dígitos). */
export function formatCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}
