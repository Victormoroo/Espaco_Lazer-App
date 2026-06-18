import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../constants/colors';

type Props = {
  children: React.ReactNode;
  /** Habilita rolagem (útil quando o teclado abre). */
  scroll?: boolean;
  /** Centraliza o conteúdo vertical e horizontalmente. */
  center?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
};

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
}: Props) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, center && styles.center, style]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, center && styles.center, style]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 },
  center: { justifyContent: 'center', alignItems: 'center' },
});
