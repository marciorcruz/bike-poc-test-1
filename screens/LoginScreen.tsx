import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { commonStyles } from '../styles/commonStyles';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToMap: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateToMap,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
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
      console.log('Login successful, navigating to map...');
      // Reset form
      setEmail('');
      setPassword('');
      // Navegar para o mapa
      onNavigateToMap();
      console.log('Navigation function called');
      // Mostrar alert após navegação
      setTimeout(() => {
        Alert.alert('Sucesso', `Bem-vindo!`);
      }, 100);
    }, 2000);
  };

  return (
    <View style={commonStyles.screenContainer}>
      <Text style={commonStyles.title}>Bike Itaú</Text>
      <Text style={commonStyles.subtitle}>Faça seu login</Text>

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

      <View style={commonStyles.inputContainer}>
        <TextInput
          style={commonStyles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={[
          commonStyles.primaryButton,
          isLoading && commonStyles.primaryButtonDisabled
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={commonStyles.primaryButtonText}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={commonStyles.secondaryButton}
        onPress={onNavigateToForgotPassword}
      >
        <Text style={commonStyles.secondaryButtonText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <View style={commonStyles.footer}>
        <Text style={commonStyles.footerText}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text style={commonStyles.footerLinkText}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
