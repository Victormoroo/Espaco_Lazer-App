import React, { createContext, useContext, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../constants/colors';
import { useAuth } from '../../features/auth/context/AuthContext';

/** Âncora = centro horizontal e base (y) do ícone de perfil, em coords da tela. */
type Ancora = { x: number; y: number };

type ProfileMenuContextValue = { abrir: (ancora: Ancora) => void };

const ProfileMenuContext = createContext<ProfileMenuContextValue | null>(null);

export function useProfileMenu(): ProfileMenuContextValue {
  const ctx = useContext(ProfileMenuContext);
  if (!ctx) {
    throw new Error('useProfileMenu deve ser usado dentro de <ProfileMenuProvider>.');
  }
  return ctx;
}

/**
 * Provider do menu de perfil. Renderiza um popover que "sai" do ícone de perfil:
 * o caret é centralizado no ícone e o cartão aparece logo abaixo. A posição vem
 * da medição real do ícone (ProfileButton), então não depende de estimativas.
 */
export function ProfileMenuProvider({ children }: { children: React.ReactNode }) {
  const [ancora, setAncora] = useState<Ancora | null>(null);
  const router = useRouter();
  const { sair: sairAuth } = useAuth();

  function fechar() {
    setAncora(null);
  }

  async function sair() {
    setAncora(null);
    await sairAuth();
    router.replace('/login');
  }

  return (
    <ProfileMenuContext.Provider value={{ abrir: (a) => setAncora(a) }}>
      {children}

      <Modal
        transparent
        visible={ancora !== null}
        animationType="fade"
        onRequestClose={fechar}
      >
        <Pressable style={styles.backdrop} onPress={fechar}>
          {ancora ? (
            <>
              <View style={[styles.caret, { left: ancora.x - 8, top: ancora.y + 4 }]} />
              <View style={[styles.card, { top: ancora.y + 13 }]}>
                <Text style={styles.titulo}>CONTA</Text>
                <View style={styles.divisor} />
                <TouchableOpacity
                  style={styles.item}
                  onPress={sair}
                  accessibilityRole="button"
                  accessibilityLabel="Sair"
                >
                  <Ionicons name="log-out-outline" size={20} color={AppColors.error} />
                  <Text style={styles.itemTexto}>Sair</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </Pressable>
      </Modal>
    </ProfileMenuContext.Provider>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  caret: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: AppColors.white,
  },
  card: {
    position: 'absolute',
    right: 8,
    minWidth: 190,
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: AppColors.darkBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  titulo: {
    fontSize: 11,
    color: AppColors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  divisor: { height: 1, backgroundColor: AppColors.border, marginVertical: 2 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemTexto: { fontSize: 15, color: AppColors.darkBlue, fontWeight: '600' },
});
