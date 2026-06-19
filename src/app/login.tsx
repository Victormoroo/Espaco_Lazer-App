import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth/context/AuthContext';
import { LoginScreen } from '../features/auth/screens/LoginScreen';

// Rota "/login". Se já houver sessão, vai direto para a área autenticada.
export default function Login() {
  const { sessao } = useAuth();
  if (sessao) return <Redirect href="/inicio" />;
  return <LoginScreen />;
}
