import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { sidebarStyles } from './styles/sidebarStyles';

const { width } = Dimensions.get('window');

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToLogin: () => void;
  onNavigateToMyPlan: () => void;
  onNavigateToMyPayments: () => void;
  onNavigateToProfile: () => void;
  onNavigateToTripHistory: () => void;
  onNavigateToSupport: () => void;
  onNavigateToHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onClose,
  onNavigateToLogin,
  onNavigateToMyPlan,
  onNavigateToMyPayments,
  onNavigateToProfile,
  onNavigateToTripHistory,
  onNavigateToSupport,
  onNavigateToHelp
}) => {
  const slideAnim = useRef(new Animated.Value(-width * 0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const menuItems = [
    { id: 'plan', title: 'Meu Plano' },
    { id: 'history', title: 'Histórico de Viagens' },
    { id: 'payments', title: 'Meus Pagamentos' },
    { id: 'support', title: 'Atendimento' },
    { id: 'help', title: 'Ajuda' },
  ];

  const handleMenuPress = (itemId: string) => {
    console.log(`Menu item pressed: ${itemId}`);
    onClose();

    switch (itemId) {
      case 'plan':
        onNavigateToMyPlan();
        break;
      case 'payments':
        onNavigateToMyPayments();
        break;
      case 'history':
        onNavigateToTripHistory();
        break;
      case 'support':
        onNavigateToSupport();
        break;
      case 'help':
        onNavigateToHelp();
        break;
    }
  };

  const handleLogout = () => {
    onClose();
    onNavigateToLogin();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={sidebarStyles.overlay}>
        <Animated.View
          style={[
            sidebarStyles.sidebar,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <SafeAreaView style={sidebarStyles.safeArea}>
            {/* Header do Sidebar */}
            <View style={sidebarStyles.header}>
              <TouchableOpacity
                style={sidebarStyles.userInfo}
                onPress={() => {
                  onClose();
                  onNavigateToProfile();
                }}
              >
                <View style={sidebarStyles.avatar}>
                  <Text style={sidebarStyles.avatarText}>M</Text>
                </View>
                <View style={sidebarStyles.userDetails}>
                  <Text style={sidebarStyles.userName}>Marcio</Text>
                  <Text style={sidebarStyles.userEmail}>marcio.cruz@tembici.com</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={sidebarStyles.closeButton}
                onPress={onClose}
              >
                <Text style={sidebarStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>



            {/* Menu Items */}
            <ScrollView style={sidebarStyles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={sidebarStyles.menuItem}
                  onPress={() => handleMenuPress(item.id)}
                >
                  <Text style={sidebarStyles.menuText}>{item.title}</Text>
                  <Text style={sidebarStyles.menuArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Footer */}
            <View style={sidebarStyles.footer}>
              <TouchableOpacity
                style={sidebarStyles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={sidebarStyles.logoutText}>Sair</Text>
              </TouchableOpacity>
              
              <Text style={sidebarStyles.versionText}>Versão 1.0.0</Text>
            </View>
          </SafeAreaView>
        </Animated.View>

        <TouchableOpacity
          style={sidebarStyles.overlayTouch}
          onPress={onClose}
          activeOpacity={1}
        />
      </View>
    </Modal>
  );
};
