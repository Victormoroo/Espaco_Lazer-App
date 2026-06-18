export type Locatario = {
  id: string;
  nome: string;
  cpf: string; // só dígitos
  telefone: string; // só dígitos
  email?: string;
  endereco?: string;
  observacoes?: string;
  criadoEm: string; // ISO 8601
};

export type LocatarioInput = Omit<Locatario, 'id' | 'criadoEm'>;
