# Espaço Lazer

> Gestão de locações — _Gestão completa, mais tempo para aproveitar._

App mobile pessoal para controle do aluguel de uma área de lazer.
Construído com **React Native + Expo (Expo Router)**, **TypeScript** e
**Supabase** (preparado para uso futuro).

Esta é a **primeira etapa**: splash → login → home provisória. As demais
funcionalidades (reservas, calendário, locatários, check-in/out, contratos,
pagamentos, histórico, documentos) serão adicionadas depois.

---

## Pré-requisitos

- Node.js 18+ (testado com Node 24)
- App **Expo Go** no celular **ou** um emulador Android / simulador iOS

## Como rodar

```bash
npm install
npm start
```

Depois, leia o QR Code com o **Expo Go** (Android/iOS) ou pressione `a` (Android)
/ `i` (iOS) no terminal.

> Se mexer em `app.config.ts` ou adicionar imagens, reinicie limpando o cache:
> `npx expo start -c`.

### Scripts disponíveis

| Comando             | O que faz                          |
| ------------------- | ---------------------------------- |
| `npm start`         | Inicia o bundler do Expo           |
| `npm run android`   | Abre no Android                    |
| `npm run ios`       | Abre no iOS                        |
| `npm run typecheck` | Checagem de tipos (TypeScript)     |

## Como testar o login

Na tela de login, informe:

```
CPF:   447.521.288-02
Senha: admin
```

- Credenciais corretas → vai para a Home.
- CPF ou senha errados → exibe mensagem de erro.
- O CPF pode ser digitado com ou sem máscara (a comparação ignora pontos/traço).

## Imagens oficiais

Coloque os arquivos em `assets/images/` seguindo `assets/images/README.md`.
Enquanto não existirem, o app usa um **fallback textual** e não quebra.

## Supabase

Edite `src/shared/lib/supabase.ts` e preencha:

```ts
const supabaseUrl = 'COLE_AQUI_A_URL_DO_SUPABASE';
const supabaseAnonKey = 'COLE_AQUI_A_ANON_KEY_DO_SUPABASE';
```

(Painel do Supabase → **Project Settings → API**.)
Nesta etapa o client ainda **não é usado** — está pronto para a fase de
autenticação real.

---

## Estrutura de pastas

```
src/
  app/                      # Rotas (Expo Router)
    _layout.tsx             # Stack raiz + SafeAreaProvider + StatusBar
    index.tsx               # "/"       → Splash
    login.tsx               # "/login"  → Login
    home.tsx                # "/home"   → Home provisória

  shared/
    constants/              # colors, strings, auth, assets
    lib/supabase.ts         # client do Supabase (uso futuro)
    utils/cpf.ts            # máscara/normalização de CPF
    components/             # AppLogo, AppButton, AppInput, ScreenContainer

  features/
    auth/
      services/authService.ts   # validação local (CPF + senha)
      screens/LoginScreen.tsx
    splash/screens/SplashScreen.tsx
    home/screens/HomeScreen.tsx

assets/images/              # logos + ícone (adicionar manualmente)
```

## Fluxo de navegação

```
Splash ("/")  --2s-->  Login ("/login")  --credenciais ok-->  Home ("/home")
                                  ^                                |
                                  |------------- Sair -------------|
```

`router.replace()` é usado em todas as transições para que o botão "voltar"
não retorne à splash nem ao login após autenticar.
