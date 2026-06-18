import { buscarEnderecoPorCep } from './cepService';

describe('buscarEnderecoPorCep', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retorna null para CEP sem 8 dígitos (sem chamar a rede)', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    expect(await buscarEnderecoPorCep('123')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mapeia a resposta do ViaCEP (localidade -> cidade)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
      }),
    }) as unknown as typeof fetch;

    expect(await buscarEnderecoPorCep('01310-100')).toEqual({
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
    });
  });

  it('retorna null quando o ViaCEP responde { erro: true }', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ erro: true }),
    }) as unknown as typeof fetch;
    expect(await buscarEnderecoPorCep('00000000')).toBeNull();
  });

  it('retorna null em erro de rede', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network')) as unknown as typeof fetch;
    expect(await buscarEnderecoPorCep('01310100')).toBeNull();
  });
});
