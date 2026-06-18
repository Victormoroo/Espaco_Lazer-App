import { useLocalSearchParams } from 'expo-router';
import { LocatarioDetailScreen } from '../../../features/locatarios/screens/LocatarioDetailScreen';

export default function DetalhesLocatario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LocatarioDetailScreen id={id} />;
}
