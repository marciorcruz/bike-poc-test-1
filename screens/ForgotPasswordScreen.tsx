import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { commonStyles } from '../styles/commonStyles';

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigateToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu email');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sucesso', 'Instruções enviadas para seu email!', [
        { text: 'OK', onPress: () => {
          // Reset form
          setEmail('');
          onNavigateToLogin();
        }}
      ]);
    }, 2000);
  };

  return (
    <View style={commonStyles.screenContainer}>
      <Text style={commonStyles.title}>Bike Itaú</Text>
      <Text style={commonStyles.subtitle}>Recuperar senha</Text>
      <Text style={commonStyles.description}>
        Digite seu email e enviaremos instruções para redefinir sua senha.
      </Text>

      <View style={commonStyles.inputContainer}>
        <TextInput
          style={commonStyles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[
          commonStyles.primaryButton,
          isLoading && commonStyles.primaryButtonDisabled
        ]}
        onPress={handleForgotPassword}
        disabled={isLoading}
      >
        <Text style={commonStyles.primaryButtonText}>
          {isLoading ? 'Enviando...' : 'Enviar instruções'}
        </Text>
      </TouchableOpacity>

      <View style={commonStyles.footer}>
        <Text style={commonStyles.footerText}>Lembrou da senha?</Text>
        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={commonStyles.footerLinkText}> Fazer login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
