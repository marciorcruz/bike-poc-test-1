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
import { paymentStyles } from './styles/paymentStyles';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
}

interface PaymentScreenProps {
  plan: Plan;
  onNavigateBack: () => void;
  onPaymentSuccess: (cardData: any) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  plan,
  onNavigateBack,
  onPaymentSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text.replace(/\s/g, ''));
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      setCvv(cleaned);
    }
  };

  const validateForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Erro', 'Número do cartão inválido');
      return false;
    }
    if (!cardName.trim()) {
      Alert.alert('Erro', 'Nome do titular é obrigatório');
      return false;
    }
    if (!expiryDate || expiryDate.length !== 5) {
      Alert.alert('Erro', 'Data de validade inválida');
      return false;
    }
    if (!cvv || cvv.length !== 3) {
      Alert.alert('Erro', 'CVV inválido');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simular processamento do pagamento
    setTimeout(() => {
      setIsLoading(false);
      
      const cardData = {
        number: cardNumber,
        name: cardName,
        expiryDate: expiryDate,
        lastFourDigits: cardNumber.slice(-4),
        brand: 'Visa', // Simplificado
      };

      Alert.alert(
        'Pagamento Aprovado!',
        `Seu plano ${plan.name} foi ativado com sucesso.`,
        [
          {
            text: 'OK',
            onPress: () => onPaymentSuccess(cardData)
          }
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={paymentStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={paymentStyles.safeArea}>
        {/* Header */}
        <View style={paymentStyles.header}>
          <TouchableOpacity 
            style={paymentStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={paymentStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={paymentStyles.headerTitle}>Pagamento</Text>
          <View style={paymentStyles.placeholder} />
        </View>

        <ScrollView style={paymentStyles.scrollContainer}>
          {/* Plan Summary */}
          <View style={paymentStyles.planSummary}>
            <Text style={paymentStyles.summaryTitle}>Resumo do pedido</Text>
            <View style={paymentStyles.summaryRow}>
              <Text style={paymentStyles.summaryLabel}>{plan.name}</Text>
              <Text style={paymentStyles.summaryValue}>{formatPrice(plan.price)}</Text>
            </View>
            <View style={paymentStyles.summaryDivider} />
            <View style={paymentStyles.summaryRow}>
              <Text style={paymentStyles.summaryTotalLabel}>Total</Text>
              <Text style={paymentStyles.summaryTotalValue}>{formatPrice(plan.price)}</Text>
            </View>
          </View>

          {/* Payment Form */}
          <View style={paymentStyles.formContainer}>
            <Text style={paymentStyles.formTitle}>Dados do cartão</Text>
            
            <View style={paymentStyles.inputContainer}>
              <Text style={paymentStyles.inputLabel}>Número do cartão</Text>
              <TextInput
                style={paymentStyles.input}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={paymentStyles.inputContainer}>
              <Text style={paymentStyles.inputLabel}>Nome do titular</Text>
              <TextInput
                style={paymentStyles.input}
                value={cardName}
                onChangeText={setCardName}
                placeholder="Nome como está no cartão"
                autoCapitalize="words"
              />
            </View>

            <View style={paymentStyles.rowContainer}>
              <View style={[paymentStyles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={paymentStyles.inputLabel}>Validade</Text>
                <TextInput
                  style={paymentStyles.input}
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  placeholder="MM/AA"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[paymentStyles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Text style={paymentStyles.inputLabel}>CVV</Text>
                <TextInput
                  style={paymentStyles.input}
                  value={cvv}
                  onChangeText={handleCvvChange}
                  placeholder="000"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Payment Button */}
        <View style={paymentStyles.bottomContainer}>
          <TouchableOpacity
            style={[
              paymentStyles.paymentButton,
              isLoading && paymentStyles.paymentButtonDisabled
            ]}
            onPress={handlePayment}
            disabled={isLoading}
          >
            <Text style={paymentStyles.paymentButtonText}>
              {isLoading ? 'Processando...' : `Pagar ${formatPrice(plan.price)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
