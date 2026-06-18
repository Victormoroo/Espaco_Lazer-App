export type Locatario = {
  id: string;
  nome: string;
  cpf: string; // só dígitos
  telefone: string; // só dígitos
  email?: string;
  // Endereço (todos opcionais)
  cep?: string; // só dígitos
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string; // 2 letras maiúsculas
  observacoes?: string;
  criadoEm: string; // ISO 8601
};

export type LocatarioInput = Omit<Locatario, 'id' | 'criadoEm'>;
