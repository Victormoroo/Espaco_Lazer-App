# Cadastro de Locatários — Design

**Data:** 2026-06-18
**Status:** Aprovado (pré-implementação)
**Etapa:** Primeira feature funcional após o scaffold (splash/login/home).

## Contexto e objetivo

O app **Espaço Lazer** gerencia a locação de uma área de lazer. Esta etapa entrega
o **cadastro de locatários** (CRUD completo) — base para reservas, contratos e
histórico nas próximas fases.

Nesta etapa os dados ficam **em memória** (não persistem ao fechar o app). A camada
de dados será desenhada isolada para que a migração futura para o **Supabase**
(Postgres) altere apenas o "miolo", sem mexer nas telas.

## Escopo

### Incluído
- Listar locatários (com busca/filtro por nome ou CPF).
- Adicionar locatário.
- Ver detalhes de um locatário.
- Editar locatário.
- Excluir locatário (com confirmação).
- Validação de formulário, incluindo CPF válido e único.
- Home reformulada como **hub** com cards de seções (primeiro card: "Locatários").
- Testes unitários das funções puras (validação e máscaras).

### Fora de escopo (próximas etapas)
- Persistência real / Supabase (DB, RLS, sync).
- Reservas, calendário, check-in/out, contratos, pagamentos, histórico, documentos.
- Autenticação real (continua a validação local de login).
- Importação/exportação de dados.

## Decisões-chave

| Decisão | Escolha | Motivo |
|---|---|---|
| Armazenamento | Em memória (React Context) agora | Avançar rápido; trocar por Supabase depois sem alterar telas |
| Estado | Context + Provider + hook `useLocatarios()` | Reativo, sem dependências novas, seam único para o Supabase |
| Navegação | Home como hub (cards) → pilha de telas | Escala conforme novas seções surgem |
| CPF | Validar dígito verificador + bloquear duplicado | Integridade dos dados |
| Testes | jest-expo cobrindo funções puras | Lógica de validação/máscara é crítica e fácil de testar |

## Modelo de dados

```ts
// features/locatarios/types.ts
export type Locatario = {
  id: string;            // gerado localmente
  nome: string;
  cpf: string;           // armazenado só com dígitos (sem máscara)
  telefone: string;      // armazenado só com dígitos
  email?: string;
  // Endereço estruturado (todos opcionais)
  cep?: string;          // armazenado só com dígitos
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;           // 2 letras maiúsculas
  observacoes?: string;
  criadoEm: string;      // ISO 8601, gerado automaticamente
};

// Entrada do formulário (sem campos gerados pelo sistema)
export type LocatarioInput = Omit<Locatario, 'id' | 'criadoEm'>;
```

Observação: CPF e telefone são **persistidos só com dígitos** (normalizados); a máscara
é aplicada apenas na exibição/edição. Isso facilita busca e comparação de duplicados.

## Arquitetura

### Camada de estado — `LocatariosProvider`
- Arquivo: `features/locatarios/context/LocatariosContext.tsx`.
- Mantém `Locatario[]` em `useState`.
- Montado no `_layout` raiz (`src/app/_layout.tsx`), envolvendo o `Stack`, para que o
  estado persista durante toda a navegação.
- Expõe o hook `useLocatarios()`:
  - `locatarios: Locatario[]`
  - `adicionar(input: LocatarioInput): Locatario`
  - `atualizar(id: string, input: LocatarioInput): void`
  - `remover(id: string): void`
  - `obter(id: string): Locatario | undefined`
- `id` e `criadoEm` gerados dentro do provider.
- As transformações de lista (adicionar/atualizar/remover) ficam em **funções puras**
  (`features/locatarios/state/locatariosReducer.ts`) para serem testáveis e manter o
  provider fino.

### Estrutura de arquivos
```
src/
  app/
    _layout.tsx                      # + <LocatariosProvider>
    home.tsx                         # vira hub com cards
    locatarios/
      _layout.tsx                    # Stack com header estilizado (voltar + título)
      index.tsx                      # rota da Lista
      novo.tsx                       # rota do Formulário (criar)
      [id]/
        index.tsx                    # rota de Detalhes
        editar.tsx                   # rota do Formulário (editar)
  features/
    locatarios/
      types.ts
      context/LocatariosContext.tsx
      state/locatariosReducer.ts     # funções puras (testadas)
      validation/locatarioValidation.ts  # validação do formulário (testada)
      screens/
        LocatariosListScreen.tsx
        LocatarioFormScreen.tsx      # criar e editar
        LocatarioDetailScreen.tsx
      components/
        LocatarioListItem.tsx
  shared/
    components/
      MenuCard.tsx                   # card de seção na Home
      AppInput.tsx                   # + suporte a multiline
    utils/
      cpf.ts                         # + isValidCpf (dígito verificador)
      telefone.ts                    # formatTelefone + onlyDigits (reuso)
```

As rotas em `src/app/locatarios/**` são finas: apenas renderizam as telas de
`features/locatarios/screens` (mesmo padrão já usado em auth/home/splash).

## Telas

### Home (hub)
- Substitui o conteúdo provisório por um título de boas-vindas + grade de **cards**.
- Card "Locatários" (ícone + rótulo) → navega para `/locatarios`.
- Mantém o botão "Sair". Demais seções entram como novos cards depois.

### Lista (`/locatarios`)
- Campo de busca no topo (filtra por nome ou CPF, ignorando máscara).
- `FlatList` de `LocatarioListItem` (nome + CPF formatado + telefone).
- Botão flutuante/destacado "+" → `/locatarios/novo`.
- Toque numa linha → `/locatarios/[id]`.
- **Empty state**: mensagem amigável quando não há locatários (ou quando a busca não
  retorna resultados).

### Formulário (`/locatarios/novo` e `/locatarios/[id]/editar`)
- Componente único `LocatarioFormScreen` em modo criar/editar (no editar, pré-preenche).
- Campos: Nome, CPF (máscara), Telefone (máscara), E-mail, Endereço (multiline),
  Observações (multiline).
- Validação no salvar, com erros inline por campo.
- Sucesso: `router.replace`/`back` voltando para a lista (criar) ou detalhes (editar).

### Detalhes (`/locatarios/[id]`)
- Mostra todos os campos, inclusive observações e **data de cadastro** (dd/mm/aaaa).
- Ações: **Editar** (→ formulário) e **Excluir** (Alert de confirmação; ao confirmar,
  remove e volta para a lista).

## Validação (`locatarioValidation.ts`)

Função pura `validarLocatario(input, locatariosExistentes, idAtual?)` → mapa de erros.
- **Nome**: obrigatório (não vazio após trim).
- **CPF**: obrigatório; 11 dígitos; **dígito verificador válido**; **único** (não pode
  repetir CPF de outro locatário — ignora o próprio registro ao editar).
- **Telefone**: obrigatório; 10 ou 11 dígitos.
- **E-mail**: opcional; se preenchido, formato válido (regex simples).
- **Endereço / Observações**: opcionais, texto livre.

## Máscaras e utilitários
- `cpf.ts`: reusa `onlyDigits`/`formatCpf`; **adiciona `isValidCpf`** (algoritmo do
  dígito verificador, rejeitando sequências como `111.111.111-11`).
- `telefone.ts`: `formatTelefone` (ex.: `(00) 00000-0000`) + normalização por dígitos.

## UX e estados
- Empty state na lista (sem registros / sem resultados de busca).
- Exclusão sempre com confirmação (`Alert.alert`).
- Header das telas de locatários: azul-escuro com título branco e botão voltar nativo.
- Paleta e componentes existentes reaproveitados (identidade visual mantida).

## Testes (jest-expo)
- Configurar **jest** com preset **jest-expo** + script `test` no `package.json`.
- Cobrir funções puras:
  - `isValidCpf` (válidos, inválidos, sequências repetidas, tamanho errado).
  - `formatCpf` / `formatTelefone` (formatação progressiva).
  - `validarLocatario` (cada regra, incluindo CPF duplicado e edição do próprio).
  - `locatariosReducer` (adicionar/atualizar/remover).
- Testes de componente/tela ficam fora do escopo desta etapa (foco na lógica pura).

## Critérios de sucesso
1. A partir da Home, é possível abrir "Locatários".
2. Adicionar um locatário válido o faz aparecer na lista.
3. CPF inválido ou duplicado é bloqueado com mensagem clara.
4. É possível ver detalhes, editar e excluir (com confirmação).
5. A busca filtra por nome e por CPF.
6. `npm test` passa; `tsc --noEmit` e o bundle continuam sem erros.

## Caminho para o Supabase (futuro)
Quando as regras estiverem fechadas: criar a tabela `locatarios` no Supabase, e
reimplementar o **corpo** do `LocatariosProvider` (`adicionar/atualizar/remover/obter`)
para chamar o Supabase, mantendo a mesma interface `useLocatarios()`. Telas e validação
permanecem inalteradas.
