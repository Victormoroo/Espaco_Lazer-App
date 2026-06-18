import { ConfigContext, ExpoConfig } from 'expo/config';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Config dinâmica do app.
 *
 * `icon` e `splash.image` só são declarados quando o PNG existe (não quebra o
 * build se o arquivo for removido). As logos coloridas são PNG porque a arte
 * tem gradientes, que SVG traçado não reproduz.
 */
const exists = (relativePath: string): boolean =>
  fs.existsSync(path.resolve(__dirname, relativePath));

const ICON = './assets/images/app-icon.png';
// Splash NATIVO do Expo (tela de carregamento ao iniciar) usa o ícone do app.
const SPLASH = './assets/images/app-icon.png';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Espaço Lazer',
  slug: 'espaco-lazer',
  scheme: 'espacolazer',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  // icon: definido apenas quando app-icon.png existir (ver README de assets).
  ...(exists(ICON) ? { icon: ICON } : {}),
  splash: {
    ...(exists(SPLASH) ? { image: SPLASH } : {}),
    resizeMode: 'contain',
    backgroundColor: '#F3F5F7',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    ...(exists(ICON)
      ? {
          adaptiveIcon: {
            foregroundImage: ICON,
            backgroundColor: '#0D1B2A',
          },
        }
      : {}),
  },
  plugins: ['expo-router', 'expo-asset'],
});
