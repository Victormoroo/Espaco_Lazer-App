import { useLocalSearchParams } from 'expo-router';
import { LocatarioFormScreen } from '../../../../features/locatarios/screens/LocatarioFormScreen';

export default function EditarLocatario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LocatarioFormScreen id={id} />;
}
