import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { AppLogo } from '../../../shared/components/AppLogo';
import { AppInput } from '../../../shared/components/AppInput';
import { AppButton } from '../../../shared/components/AppButton';
import { AppColors } from '../../../shared/constants/colors';
import { AppStrings } from '../../../shared/constants/strings';
import { formatCpf } from '../../../shared/utils/cpf';
import { validateLogin } from '../services/authService';

export function LoginScreen() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    Keyboard.dismiss();
    setError(null);
    setLoading(true);

    const result = validateLogin(cpf, password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    // `replace` evita que o botão "voltar" retorne ao login depois de logar.
    router.replace('/inicio');
  }

  return (
    <ScreenContainer scroll center>
      <View style={styles.card}>
        <AppLogo variant="logoHorizontal" size="md" style={styles.logo} />
        <View style={styles.divider} />

        <AppInput
          label="CPF"
          value={cpf}
          onChangeText={(text) => setCpf(formatCpf(text))}
          placeholder="000.000.000-00"
          keyboardType="number-pad"
          maxLength={14}
          autoCapitalize="none"
          returnKeyType="next"
        />

        <AppInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <AppButton
          label="Entrar"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        />
      </View>

      <Text style={styles.footer}>{AppStrings.appPhrase}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: AppColors.darkBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: { alignSelf: 'center' },
  divider: {
    height: 2,
    width: 48,
    borderRadius: 2,
    backgroundColor: AppColors.gold,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 22,
  },
  error: {
    color: AppColors.error,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  button: { marginTop: 8 },
  footer: {
    marginTop: 28,
    color: AppColors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});
