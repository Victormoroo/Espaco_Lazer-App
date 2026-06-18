import { formatCep } from './cep';

describe('formatCep', () => {
  it('formata CEP completo', () => {
    expect(formatCep('01310100')).toBe('01310-100');
  });

  it('formata progressivamente (sem hífen até 5 dígitos)', () => {
    expect(formatCep('013')).toBe('013');
    expect(formatCep('01310')).toBe('01310');
    expect(formatCep('013101')).toBe('01310-1');
  });

  it('ignora não-dígitos e limita a 8 dígitos', () => {
    expect(formatCep('01310-100')).toBe('01310-100');
    expect(formatCep('013101009999')).toBe('01310-100');
  });
});
