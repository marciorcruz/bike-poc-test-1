import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { commonStyles } from '../styles/commonStyles';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => {
          // Reset form
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          onNavigateToLogin();
        }}
      ]);
    }, 2000);
  };

  return (
    <View style={commonStyles.screenContainer}>
      <Text style={commonStyles.title}>Bike Itaú</Text>
      <Text style={commonStyles.subtitle}>Criar conta</Text>

      <View style={commonStyles.inputContainer}>
        <TextInput
          style={commonStyles.input}
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

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

      <View style={commonStyles.inputContainer}>
        <TextInput
          style={commonStyles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={[
          commonStyles.primaryButton,
          isLoading && commonStyles.primaryButtonDisabled
        ]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={commonStyles.primaryButtonText}>
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </Text>
      </TouchableOpacity>

      <View style={commonStyles.footer}>
        <Text style={commonStyles.footerText}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={commonStyles.footerLinkText}> Fazer login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
