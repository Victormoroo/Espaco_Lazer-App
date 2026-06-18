import { formatTelefone } from './telefone';

describe('formatTelefone', () => {
  it('formata celular (11 dígitos)', () => {
    expect(formatTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  it('formata fixo (10 dígitos)', () => {
    expect(formatTelefone('1133334444')).toBe('(11) 3333-4444');
  });

  it('formata progressivamente', () => {
    expect(formatTelefone('11')).toBe('(11');
    expect(formatTelefone('119')).toBe('(11) 9');
  });

  it('limita a 11 dígitos', () => {
    expect(formatTelefone('119876543219999')).toBe('(11) 98765-4321');
  });
});
