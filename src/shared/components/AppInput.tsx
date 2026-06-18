import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { AppColors } from '../constants/colors';

type Props = TextInputProps & {
  label: string;
};

/** Campo de texto rotulado e estilizado, reaproveitável nos formulários. */
export function AppInput({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={AppColors.textMuted}
        style={[styles.input, style]}
        {...rest}
      />
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
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.white,
    paddingHorizontal: 16,
    fontSize: 16,
    color: AppColors.darkBlue,
  },
});
