# Imagens oficiais do Espaço Lazer

| Arquivo                | Dimensões | Uso                                       |
| ---------------------- | --------- | ----------------------------------------- |
| `logo-principal.png`   | 1254×1254 | Logo principal                            |
| `logo-horizontal.png`  | 2172×724  | Logo horizontal (topo da tela de login)   |
| `logo-empilhada.png`   | 1122×1402 | Logo empilhada (splash do app)            |
| `app-icon.png`         | 1024×1024 | Ícone do app (quadrado, opaco)            |

> **Formato:** PNG colorido. A arte tem gradientes (degradê do "Lazer", ondas),
> que SVG traçado (potrace) não reproduz — por isso usamos PNG.

## Como o app usa cada uma
- As logos são `require`das em `src/shared/constants/assets.ts` e renderizadas
  pelo `AppLogo`, dimensionadas pela proporção real (nunca distorcem).
- O ícone (`app-icon.png`) é usado só pela config nativa em `app.config.ts`.

## Trocar/atualizar
Substitua o arquivo mantendo o **mesmo nome** e reinicie com `npx expo start -c`.
Para o ícone: PNG quadrado, fundo opaco (iOS) e logo com folga nas bordas
(o Android corta num círculo).
