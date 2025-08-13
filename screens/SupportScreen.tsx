import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import { supportStyles } from './styles/supportStyles';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  status: 'open' | 'closed' | 'waiting';
  unreadCount: number;
}

interface SupportScreenProps {
  onNavigateBack: () => void;
  onOpenChat: (conversationId?: string) => void;
}

// Dados simulados de conversas
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Problema com cobrança',
    lastMessage: 'Obrigado pelo atendimento!',
    timestamp: '2024-01-15T14:30:00',
    status: 'closed',
    unreadCount: 0
  },
  {
    id: '2',
    title: 'Bike com defeito',
    lastMessage: 'Vamos verificar a bike #1234 para você.',
    timestamp: '2024-01-14T16:45:00',
    status: 'waiting',
    unreadCount: 1
  },
  {
    id: '3',
    title: 'Dúvida sobre planos',
    lastMessage: 'Qual a diferença entre os planos?',
    timestamp: '2024-01-12T10:20:00',
    status: 'open',
    unreadCount: 0
  },
  {
    id: '4',
    title: 'Estação fora do ar',
    lastMessage: 'A estação Paulista está sem bikes.',
    timestamp: '2024-01-10T09:15:00',
    status: 'closed',
    unreadCount: 0
  }
];

export const SupportScreen: React.FC<SupportScreenProps> = ({
  onNavigateBack,
  onOpenChat,
}) => {
  const [conversations] = useState<Conversation[]>(mockConversations);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora há pouco';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#4CAF50';
      case 'waiting': return '#FF9800';
      case 'closed': return '#666';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'waiting': return 'Aguardando';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };



  return (
    <SafeAreaView style={supportStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={supportStyles.safeArea}>
        {/* Header */}
        <View style={supportStyles.header}>
          <TouchableOpacity 
            style={supportStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={supportStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={supportStyles.headerTitle}>Atendimento</Text>
          <View style={supportStyles.placeholder} />
        </View>

        <ScrollView style={supportStyles.scrollContainer}>
          {/* Support Info */}
          <View style={supportStyles.supportInfo}>
            <Text style={supportStyles.supportTitle}>Central de Ajuda</Text>
            <Text style={supportStyles.supportSubtitle}>
              Estamos aqui para ajudar! Veja suas conversas anteriores ou inicie um novo atendimento.
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={supportStyles.quickActions}>
            <TouchableOpacity style={supportStyles.quickActionButton}>
              <Text style={supportStyles.quickActionText}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={supportStyles.quickActionButton}>
              <Text style={supportStyles.quickActionText}>Reportar Problema</Text>
            </TouchableOpacity>
            <TouchableOpacity style={supportStyles.quickActionButton}>
              <Text style={supportStyles.quickActionText}>Sugestões</Text>
            </TouchableOpacity>
          </View>

          {/* Conversations List */}
          <View style={supportStyles.conversationsContainer}>
            <Text style={supportStyles.conversationsTitle}>Conversas Recentes</Text>

            {conversations.length === 0 ? (
              <View style={supportStyles.emptyContainer}>
                <Text style={supportStyles.emptyTitle}>Nenhuma conversa ainda</Text>
                <Text style={supportStyles.emptySubtitle}>
                  Inicie uma nova conversa clicando no botão abaixo
                </Text>
              </View>
            ) : (
              <View style={supportStyles.conversationsList}>
                {conversations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={supportStyles.conversationItem}
                    onPress={() => onOpenChat(item.id)}
                  >
                    <View style={supportStyles.conversationHeader}>
                      <Text style={supportStyles.conversationTitle}>{item.title}</Text>
                      <View style={supportStyles.conversationMeta}>
                        <View style={[
                          supportStyles.statusDot,
                          { backgroundColor: getStatusColor(item.status) }
                        ]} />
                        <Text style={supportStyles.statusText}>
                          {getStatusText(item.status)}
                        </Text>
                      </View>
                    </View>

                    <Text style={supportStyles.lastMessage} numberOfLines={2}>
                      {item.lastMessage}
                    </Text>

                    <View style={supportStyles.conversationFooter}>
                      <Text style={supportStyles.timestamp}>
                        {formatTimestamp(item.timestamp)}
                      </Text>
                      {item.unreadCount > 0 && (
                        <View style={supportStyles.unreadBadge}>
                          <Text style={supportStyles.unreadCount}>{item.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Chat Button */}
        <TouchableOpacity
          style={supportStyles.floatingChatButton}
          onPress={() => onOpenChat()}
        >
          <Text style={supportStyles.floatingChatButtonText}>💬</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
