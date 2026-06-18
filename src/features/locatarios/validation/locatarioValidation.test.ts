import { validarLocatario } from './locatarioValidation';
import { Locatario, LocatarioInput } from '../types';

const valido: LocatarioInput = {
  nome: 'Ana',
  cpf: '111.444.777-35',
  telefone: '(11) 98765-4321',
};

describe('validarLocatario', () => {
  it('não retorna erros para entrada válida', () => {
    expect(validarLocatario(valido, [])).toEqual({});
  });

  it('exige nome', () => {
    expect(validarLocatario({ ...valido, nome: '  ' }, []).nome).toBeDefined();
  });

  it('rejeita CPF inválido', () => {
    expect(validarLocatario({ ...valido, cpf: '111.444.777-00' }, []).cpf).toBeDefined();
  });

  it('rejeita CPF duplicado mas ignora o próprio registro', () => {
    const existente: Locatario = {
      id: '1',
      nome: 'Outro',
      cpf: '11144477735',
      telefone: '1133334444',
      criadoEm: '2026-06-18T10:00:00.000Z',
    };
    expect(validarLocatario(valido, [existente]).cpf).toBeDefined();
    expect(validarLocatario(valido, [existente], '1')).toEqual({});
  });

  it('exige telefone com 10 ou 11 dígitos', () => {
    expect(validarLocatario({ ...valido, telefone: '119' }, []).telefone).toBeDefined();
  });

  it('valida e-mail quando preenchido', () => {
    expect(validarLocatario({ ...valido, email: 'invalido' }, []).email).toBeDefined();
    expect(validarLocatario({ ...valido, email: 'a@b.com' }, []).email).toBeUndefined();
  });
});
