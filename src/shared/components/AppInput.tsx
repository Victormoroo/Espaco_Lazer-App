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
