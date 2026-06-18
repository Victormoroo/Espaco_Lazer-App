/**
 * Paleta oficial do Espaço Lazer.
 *
 * - darkBlue:  textos principais, cabeçalhos, ícones/títulos, botões fortes.
 * - turquoise: destaques, botões de ação, elementos ativos, seleção.
 * - gold:      detalhes premium, linhas decorativas, pequenos destaques.
 * - lightGray: fundo de telas, cards neutros, divisórias suaves.
 */
export const AppColors = {
  darkBlue: '#0D1B2A',
  turquoise: '#26C6C8',
  gold: '#D4AF37',
  lightGray: '#F3F5F7',
  white: '#FFFFFF',
  textMuted: '#6B7280',
  border: '#E5E9EE',
  error: '#DC2626',
} as const;

export type AppColorKey = keyof typeof AppColors;
