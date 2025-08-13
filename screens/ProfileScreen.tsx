import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { profileStyles } from './styles/profileStyles';

interface ProfileScreenProps {
  onNavigateBack: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  birthDate: string;
  gender: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// Dados simulados do usuário
const initialUserData: UserProfile = {
  name: 'Marcio',
  email: 'marcio.cruz@tembici.com',
  birthDate: '',
  gender: '',
  document: '',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  }
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateBack,
}) => {
  const [userData, setUserData] = useState<UserProfile>(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      if (cleaned.length >= 4) {
        return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4, 8);
      }
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    return cleaned;
  };

  const formatDocument = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      // CPF: 000.000.000-00
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const formatZipCode = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    Alert.alert('Sucesso', 'Senha alterada com sucesso!');
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={profileStyles.safeArea}>
        {/* Header */}
        <View style={profileStyles.header}>
          <TouchableOpacity 
            style={profileStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={profileStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={profileStyles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity 
            style={profileStyles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Text style={profileStyles.editButtonText}>
              {isEditing ? 'Salvar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={profileStyles.scrollContainer}>
          {/* Profile Header */}
          <View style={profileStyles.profileHeader}>
            <View style={profileStyles.avatar}>
              <Text style={profileStyles.avatarText}>M</Text>
            </View>
            <Text style={profileStyles.profileName}>{userData.name}</Text>
            <Text style={profileStyles.profileEmail}>{userData.email}</Text>
          </View>

          {/* Personal Info */}
          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Informações Pessoais</Text>
            
            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Nome Completo</Text>
              <TextInput
                style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                value={userData.name}
                onChangeText={(text) => setUserData({...userData, name: text})}
                editable={isEditing}
                placeholder="Digite seu nome completo"
              />
            </View>

            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Data de Nascimento</Text>
              <TextInput
                style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                value={userData.birthDate}
                onChangeText={(text) => setUserData({...userData, birthDate: formatDate(text)})}
                editable={isEditing}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Sexo</Text>
              <TextInput
                style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                value={userData.gender}
                onChangeText={(text) => setUserData({...userData, gender: text})}
                editable={isEditing}
                placeholder="Masculino/Feminino/Outro"
              />
            </View>

            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>CPF/CNPJ</Text>
              <TextInput
                style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                value={userData.document}
                onChangeText={(text) => setUserData({...userData, document: formatDocument(text)})}
                editable={isEditing}
                placeholder="000.000.000-00"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Address */}
          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Endereço</Text>
            
            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>CEP</Text>
              <TextInput
                style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                value={userData.address.zipCode}
                onChangeText={(text) => setUserData({
                  ...userData, 
                  address: {...userData.address, zipCode: formatZipCode(text)}
                })}
                editable={isEditing}
                placeholder="00000-000"
                keyboardType="numeric"
                maxLength={9}
              />
            </View>

            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Rua</Text>
              <TextInput
                style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                value={userData.address.street}
                onChangeText={(text) => setUserData({
                  ...userData, 
                  address: {...userData.address, street: text}
                })}
                editable={isEditing}
                placeholder="Nome da rua"
              />
            </View>

            <View style={profileStyles.rowContainer}>
              <View style={[profileStyles.inputContainer, { flex: 2, marginRight: 10 }]}>
                <Text style={profileStyles.inputLabel}>Número</Text>
                <TextInput
                  style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                  value={userData.address.number}
                  onChangeText={(text) => setUserData({
                    ...userData, 
                    address: {...userData.address, number: text}
                  })}
                  editable={isEditing}
                  placeholder="123"
                  keyboardType="numeric"
                />
              </View>

              <View style={[profileStyles.inputContainer, { flex: 3, marginLeft: 10 }]}>
                <Text style={profileStyles.inputLabel}>Complemento</Text>
                <TextInput
                  style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                  value={userData.address.complement}
                  onChangeText={(text) => setUserData({
                    ...userData, 
                    address: {...userData.address, complement: text}
                  })}
                  editable={isEditing}
                  placeholder="Apto, Bloco..."
                />
              </View>
            </View>

            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Bairro</Text>
              <TextInput
                style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                value={userData.address.neighborhood}
                onChangeText={(text) => setUserData({
                  ...userData, 
                  address: {...userData.address, neighborhood: text}
                })}
                editable={isEditing}
                placeholder="Nome do bairro"
              />
            </View>

            <View style={profileStyles.rowContainer}>
              <View style={[profileStyles.inputContainer, { flex: 2, marginRight: 10 }]}>
                <Text style={profileStyles.inputLabel}>Cidade</Text>
                <TextInput
                  style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                  value={userData.address.city}
                  onChangeText={(text) => setUserData({
                    ...userData, 
                    address: {...userData.address, city: text}
                  })}
                  editable={isEditing}
                  placeholder="São Paulo"
                />
              </View>

              <View style={[profileStyles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Text style={profileStyles.inputLabel}>UF</Text>
                <TextInput
                  style={[profileStyles.input, !isEditing && profileStyles.inputDisabled]}
                  value={userData.address.state}
                  onChangeText={(text) => setUserData({
                    ...userData, 
                    address: {...userData.address, state: text.toUpperCase()}
                  })}
                  editable={isEditing}
                  placeholder="SP"
                  maxLength={2}
                />
              </View>
            </View>
          </View>

          {/* Security */}
          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Segurança</Text>
            
            <TouchableOpacity 
              style={profileStyles.passwordButton}
              onPress={() => setShowPasswordModal(true)}
            >
              <Text style={profileStyles.passwordButtonText}>Alterar Senha</Text>
              <Text style={profileStyles.passwordButtonArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Password Modal */}
      {showPasswordModal && (
        <View style={profileStyles.modalOverlay}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Alterar Senha</Text>
            
            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Senha Atual</Text>
              <TextInput
                style={profileStyles.input}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                placeholder="Digite sua senha atual"
                secureTextEntry
              />
            </View>

            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Nova Senha</Text>
              <TextInput
                style={profileStyles.input}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                placeholder="Digite a nova senha"
                secureTextEntry
              />
            </View>

            <View style={profileStyles.inputContainer}>
              <Text style={profileStyles.inputLabel}>Confirmar Nova Senha</Text>
              <TextInput
                style={profileStyles.input}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                placeholder="Confirme a nova senha"
                secureTextEntry
              />
            </View>

            <View style={profileStyles.modalButtons}>
              <TouchableOpacity
                style={profileStyles.modalCancelButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={profileStyles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={profileStyles.modalConfirmButton}
                onPress={handleChangePassword}
              >
                <Text style={profileStyles.modalConfirmButtonText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
