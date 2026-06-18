import type { ImageSourcePropType } from 'react-native';

export type LogoVariant =
  | 'logoPrincipal'
  | 'logoHorizontal'
  | 'logoEmpilhada'
  | 'appIcon';

/**
 * Logos/ícone oficiais (PNG colorido). A arte tem gradientes (degradê do
 * "Lazer", ondas), por isso PNG — SVG traçado perderia as cores/gradientes.
 */
export const AppLogos: Record<LogoVariant, ImageSourcePropType> = {
  logoPrincipal: require('../../../assets/images/logo-principal.png'),
  logoHorizontal: require('../../../assets/images/logo-horizontal.png'),
  logoEmpilhada: require('../../../assets/images/logo-empilhada.png'),
  appIcon: require('../../../assets/images/app-icon.png'),
};

/** Proporção (largura / altura) de cada imagem, a partir das dimensões reais. */
export const LogoAspectRatio: Record<LogoVariant, number> = {
  logoPrincipal: 1254 / 1254, // 1.0
  logoHorizontal: 2172 / 724, // 3.0
  logoEmpilhada: 1122 / 1402, // ~0.8
  appIcon: 1024 / 1024, // 1.0
};
