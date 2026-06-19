import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth/context/AuthContext';
import { SplashScreen } from '../features/splash/screens/SplashScreen';

// Rota "/": enquanto carrega a sessão mostra a splash; depois decide o destino.
export default function Index() {
  const { carregando, sessao } = useAuth();
  if (carregando) return <SplashScreen />;
  return <Redirect href={sessao ? '/inicio' : '/login'} />;
}
