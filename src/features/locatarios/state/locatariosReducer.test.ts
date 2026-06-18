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
    const resultado = adicionarLocatario([base], novo);
    expect(resultado).toHaveLength(2);
    expect(resultado[1].nome).toBe('Bruno');
  });

  it('atualiza preservando id e criadoEm', () => {
    const resultado = atualizarLocatario([base], '1', {
      nome: 'Ana Maria',
      cpf: '11144477735',
      telefone: '11987654321',
    });
    expect(resultado[0].nome).toBe('Ana Maria');
    expect(resultado[0].id).toBe('1');
    expect(resultado[0].criadoEm).toBe(base.criadoEm);
  });

  it('remove pelo id', () => {
    expect(removerLocatario([base], '1')).toHaveLength(0);
    expect(removerLocatario([base], 'x')).toHaveLength(1);
  });
});
