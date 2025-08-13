import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { choosePlanStyles } from './styles/choosePlanStyles';
interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
  popular?: boolean;
}

interface ChoosePlanScreenProps {
  onNavigateToPayment: (plan: Plan) => void;
  onNavigateBack: () => void;
}

const availablePlans: Plan[] = [
  {
    id: 'daily',
    name: 'Plano Diário',
    price: 4.90,
    duration: 'dia',
    benefits: [
      'Viagens ilimitadas até 60 minutos',
      'Acesso a bikes mecânicas',
      'Válido por 24 horas'
    ]
  },
  {
    id: 'weekly',
    name: 'Plano Semanal',
    price: 19.90,
    duration: 'semana',
    benefits: [
      'Viagens ilimitadas até 60 minutos',
      'Acesso a bikes mecânicas e elétricas',
      'Desconto de 10% em viagens extras',
      'Válido por 7 dias'
    ]
  },
  {
    id: 'monthly',
    name: 'Plano Mensal',
    price: 29.90,
    duration: 'mês',
    popular: true,
    benefits: [
      'Viagens ilimitadas até 60 minutos',
      'Acesso a bikes mecânicas e elétricas',
      'Desconto de 20% em viagens extras',
      'Suporte prioritário',
      'Válido por 30 dias'
    ]
  },
  {
    id: 'annual',
    name: 'Plano Anual',
    price: 299.90,
    duration: 'ano',
    benefits: [
      'Viagens ilimitadas até 60 minutos',
      'Acesso a bikes mecânicas e elétricas',
      'Desconto de 30% em viagens extras',
      'Suporte prioritário',
      'Seguro contra acidentes',
      'Válido por 365 dias'
    ]
  }
];

export const ChoosePlanScreen: React.FC<ChoosePlanScreenProps> = ({
  onNavigateToPayment,
  onNavigateBack,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      onNavigateToPayment(selectedPlan);
    }
  };

  return (
    <SafeAreaView style={choosePlanStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={choosePlanStyles.safeArea}>
        {/* Header */}
        <View style={choosePlanStyles.header}>
          <TouchableOpacity 
            style={choosePlanStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={choosePlanStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={choosePlanStyles.headerTitle}>Escolher Plano</Text>
          <View style={choosePlanStyles.placeholder} />
        </View>

        <ScrollView style={choosePlanStyles.scrollContainer}>
          <Text style={choosePlanStyles.pageTitle}>Escolha o plano ideal para você</Text>
          <Text style={choosePlanStyles.pageSubtitle}>
            Todos os planos incluem viagens ilimitadas e acesso às estações
          </Text>

          {availablePlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                choosePlanStyles.planCard,
                selectedPlan?.id === plan.id && choosePlanStyles.planCardSelected,
                plan.popular && choosePlanStyles.planCardPopular
              ]}
              onPress={() => handleSelectPlan(plan)}
            >
              {plan.popular && (
                <View style={choosePlanStyles.popularBadge}>
                  <Text style={choosePlanStyles.popularBadgeText}>MAIS POPULAR</Text>
                </View>
              )}
              
              <View style={choosePlanStyles.planHeader}>
                <Text style={choosePlanStyles.planName}>{plan.name}</Text>
                <View style={choosePlanStyles.planPricing}>
                  <Text style={choosePlanStyles.planPrice}>{formatPrice(plan.price)}</Text>
                  <Text style={choosePlanStyles.planDuration}>/{plan.duration}</Text>
                </View>
              </View>

              <View style={choosePlanStyles.planBenefits}>
                {plan.benefits.map((benefit, index) => (
                  <Text key={index} style={choosePlanStyles.planBenefit}>
                    • {benefit}
                  </Text>
                ))}
              </View>

              <View style={choosePlanStyles.planSelector}>
                <View style={[
                  choosePlanStyles.radioButton,
                  selectedPlan?.id === plan.id && choosePlanStyles.radioButtonSelected
                ]}>
                  {selectedPlan?.id === plan.id && (
                    <View style={choosePlanStyles.radioButtonInner} />
                  )}
                </View>
                <Text style={choosePlanStyles.selectText}>
                  {selectedPlan?.id === plan.id ? 'Selecionado' : 'Selecionar'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Continue Button */}
        <View style={choosePlanStyles.bottomContainer}>
          <TouchableOpacity
            style={[
              choosePlanStyles.continueButton,
              !selectedPlan && choosePlanStyles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedPlan}
          >
            <Text style={[
              choosePlanStyles.continueButtonText,
              !selectedPlan && choosePlanStyles.continueButtonTextDisabled
            ]}>
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
