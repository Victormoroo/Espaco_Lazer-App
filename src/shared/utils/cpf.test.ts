import { onlyDigits, formatCpf } from './cpf';

describe('onlyDigits', () => {
  it('remove tudo que não for dígito', () => {
    expect(onlyDigits('447.521.288-02')).toBe('44752128802');
    expect(onlyDigits('abc12.3')).toBe('123');
    expect(onlyDigits('')).toBe('');
  });
});

describe('formatCpf', () => {
  it('formata progressivamente', () => {
    expect(formatCpf('447')).toBe('447');
    expect(formatCpf('4475')).toBe('447.5');
    expect(formatCpf('4475212')).toBe('447.521.2');
    expect(formatCpf('44752128802')).toBe('447.521.288-02');
  });

  it('limita a 11 dígitos', () => {
    expect(formatCpf('4475212880299999')).toBe('447.521.288-02');
  });
});
