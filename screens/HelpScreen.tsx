import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { helpStyles } from './styles/helpStyles';

interface HelpScreenProps {
  onNavigateBack: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  details: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Baixe o App",
    description: "Primeiro passo para começar a usar as bikes",
    details: [
      "Baixe o app Bike Itaú na App Store ou Google Play",
      "Crie sua conta com email e senha",
      "Confirme seu email para ativar a conta",
      "Faça login no aplicativo"
    ]
  },
  {
    id: 2,
    title: "Adquira um Plano",
    description: "Escolha o plano ideal para seu perfil",
    details: [
      "Acesse 'Meu Plano' no menu lateral",
      "Escolha entre Diário, Semanal, Mensal ou Anual",
      "Cadastre seu cartão de crédito",
      "Confirme a compra do plano",
      "Aguarde a ativação (instantânea)"
    ]
  },
  {
    id: 3,
    title: "Procure uma Estação",
    description: "Encontre a estação mais próxima no mapa",
    details: [
      "Abra o mapa na tela principal",
      "Veja as estações marcadas com ícones de bike",
      "Toque na estação para ver quantas bikes estão disponíveis",
      "Escolha uma estação próxima com bikes disponíveis",
      "Use o GPS para se dirigir até a estação"
    ]
  },
  {
    id: 4,
    title: "Vá até a Estação",
    description: "Dirija-se fisicamente até a estação escolhida",
    details: [
      "Use o mapa do app ou GPS do celular",
      "Procure pela estação Bike Itaú no local",
      "Verifique se há bikes disponíveis na estação",
      "Escolha uma bike em bom estado",
      "Verifique pneus, freios e guidão antes de retirar"
    ]
  },
  {
    id: 5,
    title: "Escolha e Desbloqueie a Bike",
    description: "Libere a bike para iniciar sua viagem",
    details: [
      "Escolha uma bike disponível na estação",
      "Opção 1: Escaneie o QR Code na bike com o app",
      "Opção 2: Digite o número da bike no app",
      "Solicite o código de desbloqueio",
      "Digite o código no painel da bike",
      "Aguarde o desbloqueio (luz verde)"
    ]
  },
  {
    id: 6,
    title: "Inicie a Viagem",
    description: "Comece a pedalar e aproveite o passeio",
    details: [
      "Retire a bike da estação após o desbloqueio",
      "Ajuste o banco na altura ideal",
      "Confirme o início da viagem no app",
      "Pedale com segurança seguindo as regras de trânsito",
      "Use capacete e equipamentos de segurança",
      "Acompanhe o tempo de viagem no app"
    ]
  },
  {
    id: 7,
    title: "Finalize a Viagem",
    description: "Entregue a bike e encerre a viagem",
    details: [
      "Procure uma estação próxima ao seu destino",
      "Encaixe a bike firmemente na estação",
      "Aguarde a confirmação de travamento (luz vermelha)",
      "A viagem será encerrada automaticamente",
      "Verifique no app se a viagem foi finalizada",
      "Receba a confirmação por notificação"
    ]
  },
  {
    id: 8,
    title: "Encerramento Manual (Opcional)",
    description: "Como encerrar manualmente se necessário",
    details: [
      "Use apenas em casos especiais",
      "Toque em 'Encerrar Viagem' no app",
      "O app verificará sua localização",
      "Confirme se você está próximo a uma estação",
      "Certifique-se de que a bike está segura na estação",
      "Aguarde a confirmação do encerramento"
    ]
  },
  {
    id: 9,
    title: "Acompanhe sua Evolução",
    description: "Veja seu histórico e conquistas",
    details: [
      "Acesse 'Histórico de Viagens' no menu",
      "Veja todas suas viagens anteriores",
      "Acompanhe distância percorrida e calorias queimadas",
      "Confira quanto CO2 você economizou",
      "Desbloqueie conquistas e suba de nível",
      "Compartilhe suas conquistas com amigos"
    ]
  }
];

export const HelpScreen: React.FC<HelpScreenProps> = ({
  onNavigateBack,
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <SafeAreaView style={helpStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={helpStyles.safeArea}>
        {/* Header */}
        <View style={helpStyles.header}>
          <TouchableOpacity 
            style={helpStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={helpStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={helpStyles.headerTitle}>Ajuda</Text>
          <View style={helpStyles.placeholder} />
        </View>

        <ScrollView style={helpStyles.scrollContainer}>
          {/* Tutorial Header */}
          <View style={helpStyles.tutorialHeader}>
            <Text style={helpStyles.tutorialTitle}>Como Usar uma Bike</Text>
            <Text style={helpStyles.tutorialSubtitle}>
              Siga este guia passo a passo para aproveitar ao máximo o Bike Itaú
            </Text>
          </View>

          {/* Tutorial Steps */}
          <View style={helpStyles.stepsContainer}>
            {tutorialSteps.map((step) => (
              <View key={step.id} style={helpStyles.stepCard}>
                <TouchableOpacity
                  style={helpStyles.stepHeader}
                  onPress={() => toggleStep(step.id)}
                >
                  <View style={helpStyles.stepNumber}>
                    <Text style={helpStyles.stepNumberText}>{step.id}</Text>
                  </View>
                  <View style={helpStyles.stepInfo}>
                    <Text style={helpStyles.stepTitle}>{step.title}</Text>
                    <Text style={helpStyles.stepDescription}>{step.description}</Text>
                  </View>
                  <Text style={helpStyles.expandIcon}>
                    {expandedStep === step.id ? '−' : '+'}
                  </Text>
                </TouchableOpacity>

                {expandedStep === step.id && (
                  <View style={helpStyles.stepDetails}>
                    {step.details.map((detail, index) => (
                      <View key={index} style={helpStyles.detailItem}>
                        <Text style={helpStyles.detailBullet}>•</Text>
                        <Text style={helpStyles.detailText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Additional Help */}
          <View style={helpStyles.additionalHelp}>
            <Text style={helpStyles.additionalTitle}>Precisa de Mais Ajuda?</Text>
            
            <TouchableOpacity style={helpStyles.helpButton}>
              <Text style={helpStyles.helpButtonText}>Perguntas Frequentes (FAQ)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={helpStyles.helpButton}>
              <Text style={helpStyles.helpButtonText}>Falar com Atendimento</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={helpStyles.helpButton}>
              <Text style={helpStyles.helpButtonText}>Reportar Problema</Text>
            </TouchableOpacity>
          </View>

          {/* Safety Tips */}
          <View style={helpStyles.safetyTips}>
            <Text style={helpStyles.safetyTitle}>Dicas de Segurança</Text>
            <View style={helpStyles.tipItem}>
              <Text style={helpStyles.tipBullet}>•</Text>
              <Text style={helpStyles.tipText}>Sempre use capacete</Text>
            </View>
            <View style={helpStyles.tipItem}>
              <Text style={helpStyles.tipBullet}>•</Text>
              <Text style={helpStyles.tipText}>Respeite as regras de trânsito</Text>
            </View>
            <View style={helpStyles.tipItem}>
              <Text style={helpStyles.tipBullet}>•</Text>
              <Text style={helpStyles.tipText}>Use a ciclovia sempre que possível</Text>
            </View>
            <View style={helpStyles.tipItem}>
              <Text style={helpStyles.tipBullet}>•</Text>
              <Text style={helpStyles.tipText}>Verifique a bike antes de usar</Text>
            </View>
            <View style={helpStyles.tipItem}>
              <Text style={helpStyles.tipBullet}>•</Text>
              <Text style={helpStyles.tipText}>Mantenha-se visível no trânsito</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
