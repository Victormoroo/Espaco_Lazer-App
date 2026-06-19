import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../constants/colors';

type Props = {
  children: React.ReactNode;
  /** Habilita rolagem (útil quando o teclado abre). */
  scroll?: boolean;
  /** Centraliza o conteúdo vertical e horizontalmente. */
  center?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  /** Bordas da área segura. Default: ['top','bottom']. Passe ['bottom'] sob header nativo. */
  edges?: Edge[];
};

/**
 * Acompanha a altura atual do teclado, para liberarmos um espaço de rolagem
 * equivalente no fim do conteúdo (o último campo/botão sobe acima do teclado,
 * sem deixar vão vazio). Funciona igual com ou sem header nativo.
 */
function useKeyboardHeight(): number {
  const [altura, setAltura] = useState(0);

  useEffect(() => {
    const aoMostrar = Keyboard.addListener('keyboardDidShow', (e) =>
      setAltura(e.endCoordinates.height),
    );
    const aoEsconder = Keyboard.addListener('keyboardDidHide', () => setAltura(0));
    return () => {
      aoMostrar.remove();
      aoEsconder.remove();
    };
  }, []);

  return altura;
}

/**
 * Container base de tela: respeita a área segura, aplica o fundo padrão e,
 * opcionalmente, rolagem + centralização. Usado por todas as telas.
 */
export function ScreenContainer({
  children,
  scroll = false,
  center = false,
  style,
  backgroundColor = AppColors.lightGray,
  edges = ['top', 'bottom'],
}: Props) {
  const alturaTeclado = useKeyboardHeight();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            center && styles.center,
            { paddingBottom: 24 + alturaTeclado },
            style,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, center && styles.center, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24 },
  center: { justifyContent: 'center', alignItems: 'center' },
});
