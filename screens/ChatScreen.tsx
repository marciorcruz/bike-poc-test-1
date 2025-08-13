import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { chatStyles } from './styles/chatStyles';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatScreenProps {
  conversationId?: string;
  onNavigateBack: () => void;
}

// Dados simulados de mensagens
const mockMessages: { [key: string]: Message[] } = {
  '1': [
    {
      id: '1',
      text: 'Olá! Estou com um problema na minha cobrança.',
      isUser: true,
      timestamp: '2024-01-15T14:25:00'
    },
    {
      id: '2',
      text: 'Olá! Vou te ajudar com isso. Pode me informar qual é o problema específico?',
      isUser: false,
      timestamp: '2024-01-15T14:26:00'
    },
    {
      id: '3',
      text: 'Foi cobrado um valor a mais no meu cartão.',
      isUser: true,
      timestamp: '2024-01-15T14:27:00'
    },
    {
      id: '4',
      text: 'Entendi. Vou verificar sua conta e resolver isso para você. Aguarde um momento.',
      isUser: false,
      timestamp: '2024-01-15T14:28:00'
    },
    {
      id: '5',
      text: 'Obrigado pelo atendimento!',
      isUser: true,
      timestamp: '2024-01-15T14:30:00'
    }
  ],
  '2': [
    {
      id: '1',
      text: 'A bike que peguei está com problema no freio.',
      isUser: true,
      timestamp: '2024-01-14T16:40:00'
    },
    {
      id: '2',
      text: 'Que situação! Pode me informar o número da bike e sua localização atual?',
      isUser: false,
      timestamp: '2024-01-14T16:42:00'
    },
    {
      id: '3',
      text: 'É a bike #1234, estou na Estação Paulista.',
      isUser: true,
      timestamp: '2024-01-14T16:43:00'
    },
    {
      id: '4',
      text: 'Vamos verificar a bike #1234 para você.',
      isUser: false,
      timestamp: '2024-01-14T16:45:00'
    }
  ]
};

export const ChatScreen: React.FC<ChatScreenProps> = ({
  conversationId,
  onNavigateBack,
}) => {
  const [messages, setMessages] = useState<Message[]>(
    conversationId ? mockMessages[conversationId] || [] : []
  );
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response
    setTimeout(() => {
      const responses = [
        'Entendi! Vou verificar isso para você.',
        'Obrigado pela informação. Estou analisando seu caso.',
        'Vou encaminhar sua solicitação para o setor responsável.',
        'Posso te ajudar com mais alguma coisa?',
        'Sua solicitação foi registrada com sucesso!'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getConversationTitle = () => {
    if (!conversationId) return 'Nova Conversa';
    
    const titles: { [key: string]: string } = {
      '1': 'Problema com cobrança',
      '2': 'Bike com defeito',
      '3': 'Dúvida sobre planos',
      '4': 'Estação fora do ar'
    };
    
    return titles[conversationId] || 'Conversa';
  };

  return (
    <SafeAreaView style={chatStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <KeyboardAvoidingView 
        style={chatStyles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={chatStyles.header}>
          <TouchableOpacity 
            style={chatStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={chatStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={chatStyles.headerInfo}>
            <Text style={chatStyles.headerTitle}>{getConversationTitle()}</Text>
            <Text style={chatStyles.headerSubtitle}>Atendimento Bike Itaú</Text>
          </View>
          <View style={chatStyles.placeholder} />
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={chatStyles.messagesContainer}
          contentContainerStyle={chatStyles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={chatStyles.emptyChat}>
              <Text style={chatStyles.emptyChatTitle}>Olá! 👋</Text>
              <Text style={chatStyles.emptyChatSubtitle}>
                Como posso te ajudar hoje? Digite sua mensagem abaixo.
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  chatStyles.messageContainer,
                  message.isUser ? chatStyles.userMessage : chatStyles.agentMessage
                ]}
              >
                <View
                  style={[
                    chatStyles.messageBubble,
                    message.isUser ? chatStyles.userBubble : chatStyles.agentBubble
                  ]}
                >
                  <Text
                    style={[
                      chatStyles.messageText,
                      message.isUser ? chatStyles.userText : chatStyles.agentText
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
                <Text style={chatStyles.messageTime}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            ))
          )}
          
          {isTyping && (
            <View style={[chatStyles.messageContainer, chatStyles.agentMessage]}>
              <View style={[chatStyles.messageBubble, chatStyles.agentBubble]}>
                <Text style={chatStyles.typingText}>Digitando...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={chatStyles.inputContainer}>
          <TextInput
            style={chatStyles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              chatStyles.sendButton,
              !inputText.trim() && chatStyles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={chatStyles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
