import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { myPlanStyles } from './styles/myPlanStyles';

interface MyPlanScreenProps {
  onNavigateToChoosePlan: () => void;
  onNavigateBack: () => void;
}

// Simulando dados do usuário
const userData = {
  hasPlan: false, // Mude para true para testar com plano ativo
  currentPlan: null,
  // currentPlan: {
  //   name: 'Plano Mensal',
  //   price: 29.90,
  //   startDate: '2024-01-15',
  //   nextBilling: '2024-02-15',
  //   benefits: [
  //     'Viagens ilimitadas até 60 minutos',
  //     'Desconto em viagens extras',
  //     'Acesso a bikes elétricas',
  //     'Suporte prioritário'
  //   ]
  // }
};

export const MyPlanScreen: React.FC<MyPlanScreenProps> = ({
  onNavigateToChoosePlan,
  onNavigateBack,
}) => {
  const [user] = useState(userData);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (!user.hasPlan) {
    return (
      <SafeAreaView style={myPlanStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
        <View style={myPlanStyles.safeArea}>
          {/* Header */}
          <View style={myPlanStyles.header}>
            <TouchableOpacity 
              style={myPlanStyles.backButton}
              onPress={onNavigateBack}
            >
              <Text style={myPlanStyles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={myPlanStyles.headerTitle}>Meu Plano</Text>
            <View style={myPlanStyles.placeholder} />
          </View>

          {/* No Plan Content */}
          <View style={myPlanStyles.noPlanContainer}>
            <View style={myPlanStyles.noPlanContent}>
              <Text style={myPlanStyles.noPlanTitle}>Você ainda não tem um plano</Text>
              <Text style={myPlanStyles.noPlanSubtitle}>
                Escolha um plano e aproveite viagens ilimitadas com desconto!
              </Text>
              
              <View style={myPlanStyles.benefitsContainer}>
                <Text style={myPlanStyles.benefitsTitle}>Com um plano você tem:</Text>
                <Text style={myPlanStyles.benefitItem}>• Viagens ilimitadas</Text>
                <Text style={myPlanStyles.benefitItem}>• Desconto em viagens extras</Text>
                <Text style={myPlanStyles.benefitItem}>• Acesso a bikes elétricas</Text>
                <Text style={myPlanStyles.benefitItem}>• Suporte prioritário</Text>
              </View>

              <TouchableOpacity
                style={myPlanStyles.choosePlanButton}
                onPress={onNavigateToChoosePlan}
              >
                <Text style={myPlanStyles.choosePlanButtonText}>Escolher Plano</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Com plano ativo
  return (
    <SafeAreaView style={myPlanStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={myPlanStyles.safeArea}>
        {/* Header */}
        <View style={myPlanStyles.header}>
          <TouchableOpacity 
            style={myPlanStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={myPlanStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={myPlanStyles.headerTitle}>Meu Plano</Text>
          <View style={myPlanStyles.placeholder} />
        </View>

        <ScrollView style={myPlanStyles.scrollContainer}>
          {/* Plan Info */}
          <View style={myPlanStyles.planCard}>
            <View style={myPlanStyles.planHeader}>
              <Text style={myPlanStyles.planName}>{user.currentPlan?.name}</Text>
              <Text style={myPlanStyles.planPrice}>
                {user.currentPlan?.price && formatPrice(user.currentPlan.price)}/mês
              </Text>
            </View>
            
            <View style={myPlanStyles.planDates}>
              <Text style={myPlanStyles.planDateText}>
                Início: {user.currentPlan?.startDate && formatDate(user.currentPlan.startDate)}
              </Text>
              <Text style={myPlanStyles.planDateText}>
                Próxima cobrança: {user.currentPlan?.nextBilling && formatDate(user.currentPlan.nextBilling)}
              </Text>
            </View>
          </View>

          {/* Benefits */}
          <View style={myPlanStyles.benefitsCard}>
            <Text style={myPlanStyles.benefitsCardTitle}>Benefícios do seu plano</Text>
            {user.currentPlan?.benefits.map((benefit, index) => (
              <Text key={index} style={myPlanStyles.benefitItem}>• {benefit}</Text>
            ))}
          </View>

          {/* Actions */}
          <View style={myPlanStyles.actionsContainer}>
            <TouchableOpacity style={myPlanStyles.actionButton}>
              <Text style={myPlanStyles.actionButtonText}>Alterar Plano</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[myPlanStyles.actionButton, myPlanStyles.cancelButton]}>
              <Text style={[myPlanStyles.actionButtonText, myPlanStyles.cancelButtonText]}>
                Cancelar Plano
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
