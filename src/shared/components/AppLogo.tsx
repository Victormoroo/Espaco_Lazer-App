import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { AppLogos, LogoAspectRatio, LogoVariant } from '../constants/assets';
import { AppStrings } from '../constants/strings';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  variant?: LogoVariant;
  size?: Size;
  style?: StyleProp<ImageStyle>;
};

// Caixa máxima (largura x altura) por tamanho. A logo é ajustada para CABER na
// caixa preservando a proporção — então nem estoura a tela nem distorce, seja
// ela horizontal (larga) ou empilhada (alta).
const BOX: Record<Size, { maxW: number; maxH: number }> = {
  sm: { maxW: 120, maxH: 56 },
  md: { maxW: 180, maxH: 80 },
  lg: { maxW: 160, maxH: 160 },
};

/** Renderiza a logo oficial (PNG) ajustada dentro da caixa do tamanho pedido. */
export function AppLogo({ variant = 'logoEmpilhada', size = 'md', style }: Props) {
  const { maxW, maxH } = BOX[size];
  const ratio = LogoAspectRatio[variant]; // largura / altura

  let width = maxW;
  let height = width / ratio;
  if (height > maxH) {
    height = maxH;
    width = height * ratio;
  }

  return (
    <Image
      source={AppLogos[variant]}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel={AppStrings.appName}
      style={[{ width, height }, style]}
    />
  );
}
