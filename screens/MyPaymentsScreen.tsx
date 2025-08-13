import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { myPaymentsStyles } from './styles/myPaymentsStyles';

interface Card {
  id: string;
  number: string;
  name: string;
  expiryDate: string;
  lastFourDigits: string;
  brand: string;
}

interface Invoice {
  id: string;
  planName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

interface MyPaymentsScreenProps {
  onNavigateBack: () => void;
}

// Dados simulados
const mockCards: Card[] = [
  {
    id: '1',
    number: '**** **** **** 1234',
    name: 'MARCIO RIBEIRO DA CRUZ',
    expiryDate: '12/26',
    lastFourDigits: '1234',
    brand: 'Visa'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    planName: 'Plano Mensal',
    amount: 29.90,
    date: '2024-01-15',
    status: 'paid',
    dueDate: '2024-01-15'
  },
  {
    id: '2',
    planName: 'Plano Mensal',
    amount: 29.90,
    date: '2024-02-15',
    status: 'pending',
    dueDate: '2024-02-20'
  },
  {
    id: '3',
    planName: 'Plano Semanal',
    amount: 19.90,
    date: '2023-12-20',
    status: 'paid',
    dueDate: '2023-12-20'
  }
];

export const MyPaymentsScreen: React.FC<MyPaymentsScreenProps> = ({
  onNavigateBack,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'invoices'>('cards');

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'overdue': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencido';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={myPaymentsStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={myPaymentsStyles.safeArea}>
        {/* Header */}
        <View style={myPaymentsStyles.header}>
          <TouchableOpacity 
            style={myPaymentsStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={myPaymentsStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={myPaymentsStyles.headerTitle}>Meus Pagamentos</Text>
          <View style={myPaymentsStyles.placeholder} />
        </View>

        {/* Tabs */}
        <View style={myPaymentsStyles.tabsContainer}>
          <TouchableOpacity
            style={[
              myPaymentsStyles.tab,
              activeTab === 'cards' && myPaymentsStyles.tabActive
            ]}
            onPress={() => setActiveTab('cards')}
          >
            <Text style={[
              myPaymentsStyles.tabText,
              activeTab === 'cards' && myPaymentsStyles.tabTextActive
            ]}>
              Cartões
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              myPaymentsStyles.tab,
              activeTab === 'invoices' && myPaymentsStyles.tabActive
            ]}
            onPress={() => setActiveTab('invoices')}
          >
            <Text style={[
              myPaymentsStyles.tabText,
              activeTab === 'invoices' && myPaymentsStyles.tabTextActive
            ]}>
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={myPaymentsStyles.scrollContainer}>
          {activeTab === 'cards' ? (
            <View>
              <Text style={myPaymentsStyles.sectionTitle}>Cartões salvos</Text>
              
              {mockCards.length === 0 ? (
                <View style={myPaymentsStyles.emptyContainer}>
                  <Text style={myPaymentsStyles.emptyTitle}>Nenhum cartão salvo</Text>
                  <Text style={myPaymentsStyles.emptySubtitle}>
                    Adicione um cartão para facilitar seus pagamentos
                  </Text>
                </View>
              ) : (
                mockCards.map((card) => (
                  <View key={card.id} style={myPaymentsStyles.cardItem}>
                    <View style={myPaymentsStyles.cardHeader}>
                      <Text style={myPaymentsStyles.cardBrand}>{card.brand}</Text>
                      <Text style={myPaymentsStyles.cardNumber}>{card.number}</Text>
                    </View>
                    <Text style={myPaymentsStyles.cardName}>{card.name}</Text>
                    <Text style={myPaymentsStyles.cardExpiry}>Válido até {card.expiryDate}</Text>
                  </View>
                ))
              )}
              
              <TouchableOpacity style={myPaymentsStyles.addCardButton}>
                <Text style={myPaymentsStyles.addCardButtonText}>Adicionar Cartão</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={myPaymentsStyles.sectionTitle}>Histórico de faturas</Text>
              
              {mockInvoices.length === 0 ? (
                <View style={myPaymentsStyles.emptyContainer}>
                  <Text style={myPaymentsStyles.emptyTitle}>Nenhuma fatura encontrada</Text>
                  <Text style={myPaymentsStyles.emptySubtitle}>
                    Suas faturas aparecerão aqui quando você tiver um plano ativo
                  </Text>
                </View>
              ) : (
                mockInvoices.map((invoice) => (
                  <View key={invoice.id} style={myPaymentsStyles.invoiceItem}>
                    <View style={myPaymentsStyles.invoiceHeader}>
                      <Text style={myPaymentsStyles.invoicePlan}>{invoice.planName}</Text>
                      <Text style={myPaymentsStyles.invoiceAmount}>
                        {formatPrice(invoice.amount)}
                      </Text>
                    </View>
                    
                    <View style={myPaymentsStyles.invoiceDetails}>
                      <Text style={myPaymentsStyles.invoiceDate}>
                        Data: {formatDate(invoice.date)}
                      </Text>
                      <View style={myPaymentsStyles.invoiceStatus}>
                        <View style={[
                          myPaymentsStyles.statusDot,
                          { backgroundColor: getStatusColor(invoice.status) }
                        ]} />
                        <Text style={[
                          myPaymentsStyles.statusText,
                          { color: getStatusColor(invoice.status) }
                        ]}>
                          {getStatusText(invoice.status)}
                        </Text>
                      </View>
                    </View>
                    
                    {invoice.status === 'pending' && (
                      <TouchableOpacity style={myPaymentsStyles.payButton}>
                        <Text style={myPaymentsStyles.payButtonText}>Pagar Agora</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
