import {
  adicionarLocatario,
  atualizarLocatario,
  removerLocatario,
} from './locatariosReducer';
import { Locatario } from '../types';

const base: Locatario = {
  id: '1',
  nome: 'Ana',
  cpf: '11144477735',
  telefone: '11987654321',
  criadoEm: '2026-06-18T10:00:00.000Z',
};

describe('locatariosReducer', () => {
  it('adiciona ao fim da lista sem mutar a original', () => {
    const novo: Locatario = { ...base, id: '2', nome: 'Bruno' };
    const original = [base];
    const resultado = adicionarLocatario(original, novo);
    expect(resultado).toHaveLength(2);
    expect(resultado[1].nome).toBe('Bruno');
    expect(original).toHaveLength(1);
    expect(original[0]).toEqual(base);
  });

  it('atualiza preservando id e criadoEm', () => {
    const original = [base];
    const resultado = atualizarLocatario(original, '1', {
      nome: 'Ana Maria',
      cpf: '11144477735',
      telefone: '11987654321',
      email: 'ana.maria@email.com',
    });
    expect(resultado[0].nome).toBe('Ana Maria');
    expect(resultado[0].id).toBe('1');
    expect(resultado[0].criadoEm).toBe(base.criadoEm);
    expect(resultado[0].email).toBe('ana.maria@email.com');
    expect(original[0].nome).toBe('Ana');
    expect(original[0].email).toBeUndefined();
  });

  it('remove pelo id', () => {
    const original = [base];
    expect(removerLocatario(original, '1')).toHaveLength(0);
    expect(removerLocatario(original, 'x')).toHaveLength(1);
    expect(original).toHaveLength(1);
    expect(original[0]).toEqual(base);
  });
});
