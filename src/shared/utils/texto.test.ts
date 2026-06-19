import { capitalizarPalavras } from './texto';

describe('capitalizarPalavras', () => {
  it('capitaliza a primeira letra de cada palavra', () => {
    expect(capitalizarPalavras('joão da silva')).toBe('João Da Silva');
  });

  it('não altera o restante de cada palavra', () => {
    expect(capitalizarPalavras('maria DE souza')).toBe('Maria DE Souza');
  });

  it('lida com acentos', () => {
    expect(capitalizarPalavras('ângela')).toBe('Ângela');
  });

  it('preserva espaços à esquerda e string vazia', () => {
    expect(capitalizarPalavras('')).toBe('');
    expect(capitalizarPalavras('  ana')).toBe('  Ana');
  });
});
