# Cadastro de Locatários — Plano de Implementação

> **Para workers agênticos:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar tarefa a tarefa. Os passos usam checkbox (`- [ ]`).

**Goal:** Entregar o CRUD completo de locatários (listar, buscar, adicionar, ver, editar, excluir) com dados em memória, pronto para migrar ao Supabase depois.

**Architecture:** Estado em React Context (`LocatariosProvider`) montado no layout raiz, expondo o hook `useLocatarios()`. Lógica pura (validação, máscaras, reducer) isolada e testada com Jest. Telas via Expo Router sob `src/app/locatarios`. Home vira um hub com cards.

**Tech Stack:** Expo SDK 54, React Native 0.81.5, React 19.1.0, TypeScript (strict), Expo Router v6, @expo/vector-icons (Ionicons), jest-expo.

## Global Constraints

- Expo SDK 54 — `expo ~54.0.35`, `react-native 0.81.5`, `react 19.1.0`. Para libs Expo use `npx expo install <pkg>` (o `.npmrc` tem `legacy-peer-deps=true`).
- TypeScript **strict**; sem novos erros em `npx tsc --noEmit`.
- Roteamento por arquivos em `src/app` (Expo Router). Rotas são finas: só renderizam telas de `src/features/.../screens`.
- Dados **em memória** nesta etapa (sem persistência). A troca por Supabase deve alterar só o corpo do `LocatariosProvider`.
- CPF e telefone **armazenados só com dígitos**; máscara só na exibição/edição.
- Reusar `AppColors`, `AppInput`, `AppButton`, `ScreenContainer`, `AppStrings`.
- Commits em **português** (Conventional Commits), **sem nenhuma atribuição de IA** (sem `Co-Authored-By`, sem menção a Claude/Anthropic).
- Verificação por tarefa quando aplicável: `npm test`, `npx tsc --noEmit`. Verificação final inclui `npx expo export`.

---

### Task 1: Configurar Jest (jest-expo) + testes das máscaras de CPF existentes

**Files:**
- Modify: `package.json` (script `test` + bloco `jest`)
- Create: `src/shared/utils/cpf.test.ts`

**Interfaces:**
- Consumes: `onlyDigits`, `formatCpf` de `src/shared/utils/cpf.ts` (já existem).
- Produces: ambiente de testes funcional (`npm test`).

- [ ] **Step 1: Instalar dependências de teste**

```bash
npx expo install jest-expo
npm install -D jest @types/jest
```

- [ ] **Step 2: Adicionar script e config do Jest ao `package.json`**

No bloco `"scripts"` adicione `"test": "jest"`. No nível raiz do JSON adicione:

```json
"jest": {
  "preset": "jest-expo"
}
```

- [ ] **Step 3: Escrever os testes (devem falhar por enquanto — arquivo ainda não existe)**

Crie `src/shared/utils/cpf.test.ts`:

```ts
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
```

- [ ] **Step 4: Rodar os testes**

Run: `npm test`
Expected: PASS (2 suítes de `cpf.test.ts` verdes).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/shared/utils/cpf.test.ts
git commit -m "test: configura jest-expo e cobre as máscaras de CPF"
```

---

### Task 2: Validação de CPF (`isValidCpf`) — TDD

**Files:**
- Modify: `src/shared/utils/cpf.ts` (adiciona `isValidCpf`)
- Modify: `src/shared/utils/cpf.test.ts` (adiciona testes)

**Interfaces:**
- Produces: `isValidCpf(value: string): boolean` em `src/shared/utils/cpf.ts`.

- [ ] **Step 1: Escrever o teste que falha**

Adicione ao fim de `src/shared/utils/cpf.test.ts`:

```ts
import { isValidCpf } from './cpf';

describe('isValidCpf', () => {
  it('aceita CPFs válidos (com ou sem máscara)', () => {
    expect(isValidCpf('111.444.777-35')).toBe(true);
    expect(isValidCpf('44752128802')).toBe(true);
  });

  it('rejeita dígito verificador errado', () => {
    expect(isValidCpf('111.444.777-00')).toBe(false);
  });

  it('rejeita sequências repetidas', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false);
  });

  it('rejeita tamanho diferente de 11 dígitos', () => {
    expect(isValidCpf('123')).toBe(false);
    expect(isValidCpf('')).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test`
Expected: FAIL — `isValidCpf is not a function` / import inexistente.

- [ ] **Step 3: Implementar `isValidCpf`**

Adicione ao fim de `src/shared/utils/cpf.ts`:

```ts
/** Valida um CPF pelo dígito verificador (rejeita sequências repetidas). */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split('').map((c) => parseInt(c, 10));
  const calcular = (qtd: number): number => {
    let soma = 0;
    for (let i = 0; i < qtd; i++) {
      soma += digits[i] * (qtd + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return calcular(9) === digits[9] && calcular(10) === digits[10];
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `npm test`
Expected: PASS (todos os testes de CPF verdes).

- [ ] **Step 5: Commit**

```bash
git add src/shared/utils/cpf.ts src/shared/utils/cpf.test.ts
git commit -m "feat: adiciona validação de CPF por dígito verificador"
```

---

### Task 3: Máscara de telefone (`telefone.ts`) — TDD

**Files:**
- Create: `src/shared/utils/telefone.ts`
- Create: `src/shared/utils/telefone.test.ts`

**Interfaces:**
- Consumes: `onlyDigits` de `./cpf`.
- Produces: `formatTelefone(value: string): string`.

- [ ] **Step 1: Escrever o teste que falha**

Crie `src/shared/utils/telefone.test.ts`:

```ts
import { formatTelefone } from './telefone';

describe('formatTelefone', () => {
  it('formata celular (11 dígitos)', () => {
    expect(formatTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  it('formata fixo (10 dígitos)', () => {
    expect(formatTelefone('1133334444')).toBe('(11) 3333-4444');
  });

  it('formata progressivamente', () => {
    expect(formatTelefone('11')).toBe('(11');
    expect(formatTelefone('119')).toBe('(11) 9');
  });

  it('limita a 11 dígitos', () => {
    expect(formatTelefone('119876543219999')).toBe('(11) 98765-4321');
  });
});
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test`
Expected: FAIL — módulo `./telefone` inexistente.

- [ ] **Step 3: Implementar**

Crie `src/shared/utils/telefone.ts`:

```ts
import { onlyDigits } from './cpf';

export { onlyDigits };

/** Formata telefone BR progressivamente: (00) 00000-0000 (máx. 11 dígitos). */
export function formatTelefone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/utils/telefone.ts src/shared/utils/telefone.test.ts
git commit -m "feat: adiciona máscara de telefone"
```

---

### Task 4: Tipos do domínio + reducer puro — TDD

**Files:**
- Create: `src/features/locatarios/types.ts`
- Create: `src/features/locatarios/state/locatariosReducer.ts`
- Create: `src/features/locatarios/state/locatariosReducer.test.ts`

**Interfaces:**
- Produces:
  - `type Locatario = { id, nome, cpf, telefone, email?, endereco?, observacoes?, criadoEm }`
  - `type LocatarioInput = Omit<Locatario, 'id' | 'criadoEm'>`
  - `adicionarLocatario(lista: Locatario[], novo: Locatario): Locatario[]`
  - `atualizarLocatario(lista: Locatario[], id: string, input: LocatarioInput): Locatario[]`
  - `removerLocatario(lista: Locatario[], id: string): Locatario[]`

- [ ] **Step 1: Criar os tipos**

Crie `src/features/locatarios/types.ts`:

```ts
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
```

- [ ] **Step 2: Escrever o teste que falha**

Crie `src/features/locatarios/state/locatariosReducer.test.ts`:

```ts
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
```

- [ ] **Step 3: Rodar para ver falhar**

Run: `npm test`
Expected: FAIL — módulo `./locatariosReducer` inexistente.

- [ ] **Step 4: Implementar o reducer**

Crie `src/features/locatarios/state/locatariosReducer.ts`:

```ts
import { Locatario, LocatarioInput } from '../types';

export function adicionarLocatario(lista: Locatario[], novo: Locatario): Locatario[] {
  return [...lista, novo];
}

export function atualizarLocatario(
  lista: Locatario[],
  id: string,
  input: LocatarioInput,
): Locatario[] {
  return lista.map((l) => (l.id === id ? { ...l, ...input } : l));
}

export function removerLocatario(lista: Locatario[], id: string): Locatario[] {
  return lista.filter((l) => l.id !== id);
}
```

- [ ] **Step 5: Rodar para ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/locatarios/types.ts src/features/locatarios/state/
git commit -m "feat: adiciona tipos e reducer puro de locatários"
```

---

### Task 5: Validação do formulário — TDD

**Files:**
- Create: `src/features/locatarios/validation/locatarioValidation.ts`
- Create: `src/features/locatarios/validation/locatarioValidation.test.ts`

**Interfaces:**
- Consumes: `isValidCpf`, `onlyDigits` de `src/shared/utils/cpf`; `Locatario`, `LocatarioInput`.
- Produces:
  - `type ErrosLocatario = Partial<Record<keyof LocatarioInput, string>>`
  - `validarLocatario(input: LocatarioInput, existentes: Locatario[], idAtual?: string): ErrosLocatario`

- [ ] **Step 1: Escrever o teste que falha**

Crie `src/features/locatarios/validation/locatarioValidation.test.ts`:

```ts
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
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar a validação**

Crie `src/features/locatarios/validation/locatarioValidation.ts`:

```ts
import { Locatario, LocatarioInput } from '../types';
import { isValidCpf, onlyDigits } from '../../../shared/utils/cpf';

export type ErrosLocatario = Partial<Record<keyof LocatarioInput, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarLocatario(
  input: LocatarioInput,
  existentes: Locatario[],
  idAtual?: string,
): ErrosLocatario {
  const erros: ErrosLocatario = {};

  if (!input.nome.trim()) {
    erros.nome = 'Informe o nome.';
  }

  const cpf = onlyDigits(input.cpf);
  if (!cpf) {
    erros.cpf = 'Informe o CPF.';
  } else if (!isValidCpf(cpf)) {
    erros.cpf = 'CPF inválido.';
  } else if (existentes.some((l) => l.id !== idAtual && onlyDigits(l.cpf) === cpf)) {
    erros.cpf = 'Já existe um locatário com este CPF.';
  }

  const tel = onlyDigits(input.telefone);
  if (!tel) {
    erros.telefone = 'Informe o telefone.';
  } else if (tel.length < 10 || tel.length > 11) {
    erros.telefone = 'Telefone deve ter 10 ou 11 dígitos.';
  }

  const email = input.email?.trim();
  if (email && !EMAIL_REGEX.test(email)) {
    erros.email = 'E-mail inválido.';
  }

  return erros;
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/locatarios/validation/
git commit -m "feat: adiciona validação do formulário de locatário"
```

---

### Task 6: Context (`LocatariosProvider`) + montar no layout raiz

**Files:**
- Create: `src/features/locatarios/context/LocatariosContext.tsx`
- Modify: `src/app/_layout.tsx`

**Interfaces:**
- Consumes: reducer (Task 4), `onlyDigits` (cpf), tipos.
- Produces: `LocatariosProvider`, `useLocatarios(): { locatarios, adicionar, atualizar, remover, obter }`.

- [ ] **Step 1: Criar o Context**

Crie `src/features/locatarios/context/LocatariosContext.tsx`:

```tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Locatario, LocatarioInput } from '../types';
import {
  adicionarLocatario,
  atualizarLocatario,
  removerLocatario,
} from '../state/locatariosReducer';
import { onlyDigits } from '../../../shared/utils/cpf';

type LocatariosContextValue = {
  locatarios: Locatario[];
  adicionar: (input: LocatarioInput) => Locatario;
  atualizar: (id: string, input: LocatarioInput) => void;
  remover: (id: string) => void;
  obter: (id: string) => Locatario | undefined;
};

const LocatariosContext = createContext<LocatariosContextValue | null>(null);

function gerarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizar(input: LocatarioInput): LocatarioInput {
  return {
    nome: input.nome.trim(),
    cpf: onlyDigits(input.cpf),
    telefone: onlyDigits(input.telefone),
    email: input.email?.trim() || undefined,
    endereco: input.endereco?.trim() || undefined,
    observacoes: input.observacoes?.trim() || undefined,
  };
}

export function LocatariosProvider({ children }: { children: React.ReactNode }) {
  const [locatarios, setLocatarios] = useState<Locatario[]>([]);

  const value = useMemo<LocatariosContextValue>(
    () => ({
      locatarios,
      adicionar: (input) => {
        const novo: Locatario = {
          ...normalizar(input),
          id: gerarId(),
          criadoEm: new Date().toISOString(),
        };
        setLocatarios((lista) => adicionarLocatario(lista, novo));
        return novo;
      },
      atualizar: (id, input) =>
        setLocatarios((lista) => atualizarLocatario(lista, id, normalizar(input))),
      remover: (id) => setLocatarios((lista) => removerLocatario(lista, id)),
      obter: (id) => locatarios.find((l) => l.id === id),
    }),
    [locatarios],
  );

  return <LocatariosContext.Provider value={value}>{children}</LocatariosContext.Provider>;
}

export function useLocatarios(): LocatariosContextValue {
  const ctx = useContext(LocatariosContext);
  if (!ctx) {
    throw new Error('useLocatarios deve ser usado dentro de <LocatariosProvider>.');
  }
  return ctx;
}
```

- [ ] **Step 2: Montar o provider no layout raiz**

Em `src/app/_layout.tsx`, importe o provider e envolva o `<Stack>`. Resultado final:

```tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppColors } from '../shared/constants/colors';
import { LocatariosProvider } from '../features/locatarios/context/LocatariosContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <LocatariosProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: AppColors.lightGray },
          }}
        />
      </LocatariosProvider>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: EXIT 0.

- [ ] **Step 4: Commit**

```bash
git add src/features/locatarios/context/ src/app/_layout.tsx
git commit -m "feat: adiciona LocatariosProvider e monta no layout raiz"
```

---

### Task 7: Suporte a `multiline` no `AppInput`

**Files:**
- Modify: `src/shared/components/AppInput.tsx`

**Interfaces:**
- Produces: `AppInput` aceitando `multiline` (campo cresce e alinha o texto ao topo). Mantém o toggle de senha.

- [ ] **Step 1: Reescrever o `AppInput` com suporte a multiline**

Substitua todo o conteúdo de `src/shared/components/AppInput.tsx`:

```tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../constants/colors';

type Props = TextInputProps & {
  label: string;
};

export function AppInput({ label, style, secureTextEntry, multiline, ...rest }: Props) {
  const isPassword = !!secureTextEntry;
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, multiline ? styles.fieldMultiline : styles.fieldSingle]}>
        <TextInput
          placeholderTextColor={AppColors.textMuted}
          style={[styles.input, multiline ? styles.inputMultiline : styles.inputSingle, style]}
          secureTextEntry={isPassword && hidden}
          multiline={multiline}
          {...rest}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
          >
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={AppColors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    color: AppColors.darkBlue,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.white,
  },
  fieldSingle: { height: 52, alignItems: 'center' },
  fieldMultiline: { minHeight: 96, alignItems: 'stretch', paddingVertical: 4 },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: AppColors.darkBlue,
  },
  inputSingle: { height: '100%' },
  inputMultiline: { minHeight: 88, paddingTop: 12, textAlignVertical: 'top' },
  eyeBtn: { paddingHorizontal: 14, justifyContent: 'center' },
});
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: EXIT 0.

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/AppInput.tsx
git commit -m "feat: adiciona suporte a multiline no AppInput"
```

---

### Task 8: `MenuCard` + Home como hub

**Files:**
- Create: `src/shared/components/MenuCard.tsx`
- Modify: `src/features/home/screens/HomeScreen.tsx`

**Interfaces:**
- Consumes: `useRouter` (expo-router), `Ionicons`.
- Produces: `MenuCard({ title, subtitle?, icon, onPress })`; Home com card "Locatários" navegando para `/locatarios`.

- [ ] **Step 1: Criar o `MenuCard`**

Crie `src/shared/components/MenuCard.tsx`:

```tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../constants/colors';

type Props = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function MenuCard({ title, subtitle, icon, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={26} color={AppColors.turquoise} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 18,
    minHeight: 124,
    justifyContent: 'center',
    shadowColor: AppColors.darkBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: AppColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '800', color: AppColors.darkBlue },
  subtitle: { fontSize: 12, color: AppColors.textMuted, marginTop: 4 },
});
```

- [ ] **Step 2: Reescrever a `HomeScreen` como hub**

Substitua todo o conteúdo de `src/features/home/screens/HomeScreen.tsx`:

```tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuCard } from '../../../shared/components/MenuCard';
import { AppColors } from '../../../shared/constants/colors';
import { AppStrings } from '../../../shared/constants/strings';

export function HomeScreen() {
  const router = useRouter();

  function handleLogout() {
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>{AppStrings.appName}</Text>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Sair"
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.hello}>Bem-vindo ao {AppStrings.appName}</Text>
        <Text style={styles.subtitle}>{AppStrings.appSubtitle}</Text>

        <View style={styles.grid}>
          <MenuCard
            title="Locatários"
            subtitle="Cadastro e contatos"
            icon="people-outline"
            onPress={() => router.push('/locatarios')}
          />
          <View style={styles.cardSpacer} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.lightGray },
  appBar: {
    backgroundColor: AppColors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  appBarTitle: { color: AppColors.white, fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: AppColors.turquoise,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  logoutText: { color: AppColors.turquoise, fontWeight: '700', fontSize: 13 },
  body: { flex: 1, padding: 24 },
  hello: { fontSize: 22, fontWeight: '800', color: AppColors.darkBlue },
  subtitle: { fontSize: 14, color: AppColors.turquoise, fontWeight: '600', marginTop: 4, marginBottom: 24 },
  grid: { flexDirection: 'row', gap: 16 },
  cardSpacer: { flex: 1 },
});
```

(O `cardSpacer` mantém o card "Locatários" ocupando metade da largura; os próximos cards substituem o spacer.)

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: EXIT 0. (A rota `/locatarios` ainda não existe — será criada na Task 9; o `tsc` não falha por isso.)

- [ ] **Step 4: Commit**

```bash
git add src/shared/components/MenuCard.tsx src/features/home/screens/HomeScreen.tsx
git commit -m "feat: transforma a Home em hub com cards de seções"
```

---

### Task 9: Layout + tela de Lista de locatários

**Files:**
- Create: `src/app/locatarios/_layout.tsx`
- Create: `src/app/locatarios/index.tsx`
- Create: `src/features/locatarios/components/LocatarioListItem.tsx`
- Create: `src/features/locatarios/screens/LocatariosListScreen.tsx`

**Interfaces:**
- Consumes: `useLocatarios`, `formatCpf`, `formatTelefone`, `onlyDigits`, `Ionicons`.
- Produces: `LocatarioListItem({ locatario, onPress })`; `LocatariosListScreen`; rotas `/locatarios` e o layout com header.

- [ ] **Step 1: Criar o layout do grupo**

Crie `src/app/locatarios/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';
import { AppColors } from '../../shared/constants/colors';

export default function LocatariosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: AppColors.darkBlue },
        headerTintColor: AppColors.white,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: AppColors.lightGray },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Locatários' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo locatário' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="[id]/editar" options={{ title: 'Editar locatário' }} />
    </Stack>
  );
}
```

- [ ] **Step 2: Criar o item da lista**

Crie `src/features/locatarios/components/LocatarioListItem.tsx`:

```tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Locatario } from '../types';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf } from '../../../shared/utils/cpf';
import { formatTelefone } from '../../../shared/utils/telefone';

type Props = { locatario: Locatario; onPress: () => void };

export function LocatarioListItem({ locatario, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={styles.nome}>{locatario.nome}</Text>
        <Text style={styles.detalhe}>
          {formatCpf(locatario.cpf)} · {formatTelefone(locatario.telefone)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={AppColors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  info: { flex: 1 },
  nome: { fontSize: 16, fontWeight: '700', color: AppColors.darkBlue },
  detalhe: { fontSize: 13, color: AppColors.textMuted, marginTop: 2 },
});
```

- [ ] **Step 3: Criar a tela de lista**

Crie `src/features/locatarios/screens/LocatariosListScreen.tsx`:

```tsx
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocatarios } from '../context/LocatariosContext';
import { LocatarioListItem } from '../components/LocatarioListItem';
import { AppColors } from '../../../shared/constants/colors';
import { onlyDigits } from '../../../shared/utils/cpf';

export function LocatariosListScreen() {
  const router = useRouter();
  const { locatarios } = useLocatarios();
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return locatarios;
    const digitos = onlyDigits(busca);
    return locatarios.filter(
      (l) =>
        l.nome.toLowerCase().includes(termo) ||
        (digitos.length > 0 && l.cpf.includes(digitos)),
    );
  }, [busca, locatarios]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color={AppColors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou CPF"
          placeholderTextColor={AppColors.textMuted}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LocatarioListItem
            locatario={item}
            onPress={() => router.push(`/locatarios/${item.id}`)}
          />
        )}
        contentContainerStyle={
          filtrados.length === 0 ? styles.emptyContent : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={AppColors.border} />
            <Text style={styles.emptyText}>
              {locatarios.length === 0
                ? 'Nenhum locatário cadastrado.'
                : 'Nenhum resultado para a busca.'}
            </Text>
            {locatarios.length === 0 ? (
              <Text style={styles.emptyHint}>Toque em + para adicionar.</Text>
            ) : null}
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/locatarios/novo')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Adicionar locatário"
      >
        <Ionicons name="add" size={28} color={AppColors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.lightGray },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 14,
    height: 48,
    margin: 16,
    marginBottom: 4,
  },
  searchInput: { flex: 1, fontSize: 15, color: AppColors.darkBlue },
  listContent: { padding: 16 },
  emptyContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  empty: { alignItems: 'center' },
  emptyText: { marginTop: 12, fontSize: 15, color: AppColors.textMuted, textAlign: 'center' },
  emptyHint: { marginTop: 4, fontSize: 13, color: AppColors.textMuted },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.darkBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
});
```

- [ ] **Step 4: Criar a rota da lista**

Crie `src/app/locatarios/index.tsx`:

```tsx
import { LocatariosListScreen } from '../../features/locatarios/screens/LocatariosListScreen';

export default function LocatariosIndex() {
  return <LocatariosListScreen />;
}
```

- [ ] **Step 5: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: EXIT 0.

- [ ] **Step 6: Verificação manual**

Run: `npx expo start -c` → na Home, toque em "Locatários".
Expected: abre a tela "Locatários" com header azul, campo de busca, empty state ("Nenhum locatário cadastrado. Toque em + para adicionar.") e o botão "+" no canto.

- [ ] **Step 7: Commit**

```bash
git add src/app/locatarios/_layout.tsx src/app/locatarios/index.tsx src/features/locatarios/components/ src/features/locatarios/screens/LocatariosListScreen.tsx
git commit -m "feat: adiciona lista de locatários com busca e empty state"
```

---

### Task 10: Formulário de criação/edição + rotas

**Files:**
- Create: `src/features/locatarios/screens/LocatarioFormScreen.tsx`
- Create: `src/app/locatarios/novo.tsx`
- Create: `src/app/locatarios/[id]/editar.tsx`

**Interfaces:**
- Consumes: `useLocatarios`, `validarLocatario`/`ErrosLocatario`, `formatCpf`, `formatTelefone`, `AppInput`, `AppButton`, `ScreenContainer`, `LocatarioInput`, `useLocalSearchParams`.
- Produces: `LocatarioFormScreen({ id? })`; rotas `/locatarios/novo` e `/locatarios/[id]/editar`.

- [ ] **Step 1: Criar a tela de formulário**

Crie `src/features/locatarios/screens/LocatarioFormScreen.tsx`:

```tsx
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppInput } from '../../../shared/components/AppInput';
import { AppButton } from '../../../shared/components/AppButton';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf } from '../../../shared/utils/cpf';
import { formatTelefone } from '../../../shared/utils/telefone';
import { useLocatarios } from '../context/LocatariosContext';
import { validarLocatario, ErrosLocatario } from '../validation/locatarioValidation';
import { LocatarioInput } from '../types';

type Props = { id?: string };

const VAZIO: LocatarioInput = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: '',
  observacoes: '',
};

export function LocatarioFormScreen({ id }: Props) {
  const router = useRouter();
  const { locatarios, obter, adicionar, atualizar } = useLocatarios();
  const existente = id ? obter(id) : undefined;

  const [form, setForm] = useState<LocatarioInput>(() =>
    existente
      ? {
          nome: existente.nome,
          cpf: formatCpf(existente.cpf),
          telefone: formatTelefone(existente.telefone),
          email: existente.email ?? '',
          endereco: existente.endereco ?? '',
          observacoes: existente.observacoes ?? '',
        }
      : VAZIO,
  );
  const [erros, setErros] = useState<ErrosLocatario>({});

  function set<K extends keyof LocatarioInput>(campo: K, valor: LocatarioInput[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function salvar() {
    const validacao = validarLocatario(form, locatarios, id);
    setErros(validacao);
    if (Object.keys(validacao).length > 0) return;

    if (id) {
      atualizar(id, form);
    } else {
      adicionar(form);
    }
    router.back();
  }

  return (
    <ScreenContainer scroll>
      <AppInput
        label="Nome completo"
        value={form.nome}
        onChangeText={(t) => set('nome', t)}
        placeholder="Nome do locatário"
      />
      {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}

      <AppInput
        label="CPF"
        value={form.cpf}
        onChangeText={(t) => set('cpf', formatCpf(t))}
        placeholder="000.000.000-00"
        keyboardType="number-pad"
        maxLength={14}
      />
      {erros.cpf ? <Text style={styles.erro}>{erros.cpf}</Text> : null}

      <AppInput
        label="Telefone / WhatsApp"
        value={form.telefone}
        onChangeText={(t) => set('telefone', formatTelefone(t))}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
        maxLength={16}
      />
      {erros.telefone ? <Text style={styles.erro}>{erros.telefone}</Text> : null}

      <AppInput
        label="E-mail (opcional)"
        value={form.email}
        onChangeText={(t) => set('email', t)}
        placeholder="email@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}

      <AppInput
        label="Endereço (opcional)"
        value={form.endereco}
        onChangeText={(t) => set('endereco', t)}
        placeholder="Rua, número, bairro, cidade"
        multiline
      />

      <AppInput
        label="Observações (opcional)"
        value={form.observacoes}
        onChangeText={(t) => set('observacoes', t)}
        placeholder="Anotações sobre o locatário"
        multiline
      />

      <AppButton
        label={id ? 'Salvar alterações' : 'Adicionar locatário'}
        onPress={salvar}
        style={styles.botao}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  erro: { color: AppColors.error, fontSize: 13, marginTop: -8, marginBottom: 12 },
  botao: { marginTop: 8, marginBottom: 24 },
});
```

- [ ] **Step 2: Criar a rota de criação**

Crie `src/app/locatarios/novo.tsx`:

```tsx
import { LocatarioFormScreen } from '../../features/locatarios/screens/LocatarioFormScreen';

export default function NovoLocatario() {
  return <LocatarioFormScreen />;
}
```

- [ ] **Step 3: Criar a rota de edição**

Crie `src/app/locatarios/[id]/editar.tsx`:

```tsx
import { useLocalSearchParams } from 'expo-router';
import { LocatarioFormScreen } from '../../../features/locatarios/screens/LocatarioFormScreen';

export default function EditarLocatario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LocatarioFormScreen id={id} />;
}
```

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: EXIT 0.

- [ ] **Step 5: Verificação manual**

Na lista, toque em "+" → preencha e salve. Teste CPF inválido (ex.: `111.444.777-00`) e CPF duplicado — devem mostrar erro inline. Um cadastro válido aparece na lista.

- [ ] **Step 6: Commit**

```bash
git add src/features/locatarios/screens/LocatarioFormScreen.tsx src/app/locatarios/novo.tsx "src/app/locatarios/[id]/editar.tsx"
git commit -m "feat: adiciona formulário de criação e edição de locatário"
```

---

### Task 11: Tela de Detalhes + exclusão

**Files:**
- Create: `src/features/locatarios/screens/LocatarioDetailScreen.tsx`
- Create: `src/app/locatarios/[id]/index.tsx`

**Interfaces:**
- Consumes: `useLocatarios`, `formatCpf`, `formatTelefone`, `AppButton`, `ScreenContainer`, `Alert`, `useLocalSearchParams`.
- Produces: `LocatarioDetailScreen({ id })`; rota `/locatarios/[id]`.

- [ ] **Step 1: Criar a tela de detalhes**

Crie `src/features/locatarios/screens/LocatarioDetailScreen.tsx`:

```tsx
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppButton } from '../../../shared/components/AppButton';
import { AppColors } from '../../../shared/constants/colors';
import { formatCpf } from '../../../shared/utils/cpf';
import { formatTelefone } from '../../../shared/utils/telefone';
import { useLocatarios } from '../context/LocatariosContext';

type Props = { id: string };

function formatarData(iso: string): string {
  const partes = iso.slice(0, 10).split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : iso;
}

function Linha({ rotulo, valor }: { rotulo: string; valor?: string }) {
  if (!valor) return null;
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

export function LocatarioDetailScreen({ id }: Props) {
  const router = useRouter();
  const { obter, remover } = useLocatarios();
  const locatario = obter(id);

  if (!locatario) {
    return (
      <ScreenContainer center>
        <Text style={styles.naoEncontrado}>Locatário não encontrado.</Text>
      </ScreenContainer>
    );
  }

  function excluir() {
    Alert.alert(
      'Excluir locatário',
      `Remover "${locatario.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            remover(locatario.id);
            router.back();
          },
        },
      ],
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <Text style={styles.nome}>{locatario.nome}</Text>
        <View style={styles.divisor} />
        <Linha rotulo="CPF" valor={formatCpf(locatario.cpf)} />
        <Linha rotulo="Telefone" valor={formatTelefone(locatario.telefone)} />
        <Linha rotulo="E-mail" valor={locatario.email} />
        <Linha rotulo="Endereço" valor={locatario.endereco} />
        <Linha rotulo="Observações" valor={locatario.observacoes} />
        <Linha rotulo="Cadastrado em" valor={formatarData(locatario.criadoEm)} />
      </View>

      <AppButton
        label="Editar"
        onPress={() => router.push(`/locatarios/${locatario.id}/editar`)}
        style={styles.botao}
      />
      <AppButton label="Excluir" onPress={excluir} style={styles.botaoExcluir} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
  },
  nome: { fontSize: 20, fontWeight: '800', color: AppColors.darkBlue },
  divisor: { height: 1, backgroundColor: AppColors.border, marginVertical: 14 },
  linha: { marginBottom: 12 },
  rotulo: { fontSize: 12, color: AppColors.textMuted, fontWeight: '600' },
  valor: { fontSize: 15, color: AppColors.darkBlue, marginTop: 2 },
  botao: { marginTop: 16 },
  botaoExcluir: { marginTop: 12, backgroundColor: AppColors.error },
  naoEncontrado: { fontSize: 15, color: AppColors.textMuted },
});
```

- [ ] **Step 2: Criar a rota de detalhes**

Crie `src/app/locatarios/[id]/index.tsx`:

```tsx
import { useLocalSearchParams } from 'expo-router';
import { LocatarioDetailScreen } from '../../../features/locatarios/screens/LocatarioDetailScreen';

export default function DetalhesLocatario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LocatarioDetailScreen id={id} />;
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: EXIT 0.

- [ ] **Step 4: Verificação manual**

Toque numa linha da lista → vê os detalhes (incl. data de cadastro). "Editar" abre o formulário preenchido e salva. "Excluir" pede confirmação e, ao confirmar, remove e volta para a lista.

- [ ] **Step 5: Commit**

```bash
git add src/features/locatarios/screens/LocatarioDetailScreen.tsx "src/app/locatarios/[id]/index.tsx"
git commit -m "feat: adiciona detalhes e exclusão de locatário"
```

---

### Task 12: Verificação final

**Files:** nenhum (apenas verificação).

- [ ] **Step 1: Testes**

Run: `npm test`
Expected: PASS (todas as suítes: cpf, telefone, reducer, validação).

- [ ] **Step 2: Tipos**

Run: `npx tsc --noEmit`
Expected: EXIT 0.

- [ ] **Step 3: Bundle**

Run: `npx expo export --platform android --output-dir dist-verify`
Expected: EXIT 0. Depois: `rm -rf dist-verify` (ou `Remove-Item -Recurse -Force dist-verify`).

- [ ] **Step 4: Fluxo manual completo**

`npx expo start -c` → login → Home → Locatários → adicionar (válido / inválido / duplicado) → buscar → ver detalhes → editar → excluir. Tudo conforme os critérios de sucesso da spec.

- [ ] **Step 5: Commit (se houver ajustes pendentes)**

```bash
git add -A
git commit -m "chore: finaliza cadastro de locatários (verificação)"
```

---

## Self-Review

**1. Cobertura da spec:**
- Armazenamento em memória (Context) → Task 6. ✓
- Campos (nome, cpf, telefone, email, endereço, observações, criadoEm) → types Task 4, form Task 10, detalhes Task 11. ✓
- Operações: listar/buscar (Task 9), adicionar/editar (Task 10), detalhes/excluir (Task 11). ✓
- Navegação hub → Task 8; rotas/stack → Tasks 9-11. ✓
- Validação CPF (dígito verificador + único), telefone, email → Tasks 2 e 5. ✓
- Máscaras (cpf existente, telefone novo) → Tasks 1-3. ✓
- UX (empty state, busca, exclusão com confirmação) → Tasks 9 e 11. ✓
- Testes (jest-expo nas funções puras) → Tasks 1-5. ✓
- Caminho Supabase (só o corpo do provider muda) → garantido pela arquitetura do Context (Task 6). ✓

**2. Placeholders:** nenhum "TBD/TODO"; todo passo de código mostra o código completo.

**3. Consistência de tipos:** `Locatario`/`LocatarioInput` (Task 4) usados igualmente em reducer, validação, context, telas. `useLocatarios()` expõe exatamente `{ locatarios, adicionar, atualizar, remover, obter }` (Task 6) e é consumido com esses nomes nas Tasks 9-11. `ErrosLocatario` (Task 5) usado no form (Task 10). `formatTelefone`/`isValidCpf`/`onlyDigits` com assinaturas consistentes.
