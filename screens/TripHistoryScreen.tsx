import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { tripHistoryStyles } from './styles/tripHistoryStyles';

interface Trip {
  id: string;
  startStation: string;
  endStation: string;
  bikeType: 'electric' | 'mechanical';
  duration: number; // em minutos
  cost: number;
  co2Saved: number; // em gramas
  caloriesBurned: number;
  date: string;
  distance: number; // em km
}

interface TripHistoryScreenProps {
  onNavigateBack: () => void;
}

// Dados simulados de viagens
const mockTrips: Trip[] = [
  {
    id: '1',
    startStation: 'Estação Paulista',
    endStation: 'Estação Vila Madalena',
    bikeType: 'electric',
    duration: 25,
    cost: 0,
    co2Saved: 1200,
    caloriesBurned: 85,
    date: '2024-01-15',
    distance: 3.2
  },
  {
    id: '2',
    startStation: 'Estação Faria Lima',
    endStation: 'Estação Ibirapuera',
    bikeType: 'mechanical',
    duration: 18,
    cost: 0,
    co2Saved: 850,
    caloriesBurned: 120,
    date: '2024-01-14',
    distance: 2.1
  },
  {
    id: '3',
    startStation: 'Estação Liberdade',
    endStation: 'Estação Brooklin',
    bikeType: 'electric',
    duration: 32,
    cost: 0,
    co2Saved: 1500,
    caloriesBurned: 95,
    date: '2024-01-13',
    distance: 4.1
  },
  {
    id: '4',
    startStation: 'Estação Ibirapuera',
    endStation: 'Estação Paulista',
    bikeType: 'mechanical',
    duration: 22,
    cost: 0,
    co2Saved: 980,
    caloriesBurned: 140,
    date: '2024-01-12',
    distance: 2.8
  },
  {
    id: '5',
    startStation: 'Estação Vila Madalena',
    endStation: 'Estação Faria Lima',
    bikeType: 'electric',
    duration: 15,
    cost: 0,
    co2Saved: 720,
    caloriesBurned: 65,
    date: '2024-01-11',
    distance: 1.9
  }
];

export const TripHistoryScreen: React.FC<TripHistoryScreenProps> = ({
  onNavigateBack,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trips'>('dashboard');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [bikeTypeFilter, setBikeTypeFilter] = useState<'all' | 'electric' | 'mechanical'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

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

  const filteredTrips = mockTrips.filter(trip => {
    const tripDate = new Date(trip.date);
    const fromDate = dateFromFilter ? new Date(dateFromFilter) : null;
    const toDate = dateToFilter ? new Date(dateToFilter) : null;

    const matchesDateFrom = !fromDate || tripDate >= fromDate;
    const matchesDateTo = !toDate || tripDate <= toDate;
    const matchesBikeType = bikeTypeFilter === 'all' || trip.bikeType === bikeTypeFilter;

    return matchesDateFrom && matchesDateTo && matchesBikeType;
  });

  // Cálculos para o dashboard
  const totalTrips = filteredTrips.length;
  const totalDistance = filteredTrips.reduce((sum, trip) => sum + trip.distance, 0);
  const totalDuration = filteredTrips.reduce((sum, trip) => sum + trip.duration, 0);
  const totalCO2Saved = filteredTrips.reduce((sum, trip) => sum + trip.co2Saved, 0);
  const totalCalories = filteredTrips.reduce((sum, trip) => sum + trip.caloriesBurned, 0);
  const totalCost = filteredTrips.reduce((sum, trip) => sum + trip.cost, 0);

  const averageDistance = totalTrips > 0 ? totalDistance / totalTrips : 0;
  const averageDuration = totalTrips > 0 ? totalDuration / totalTrips : 0;

  // Gamificação
  const getLevel = () => {
    if (totalTrips >= 50) return { level: 5, title: 'Eco Master', next: 100 };
    if (totalTrips >= 25) return { level: 4, title: 'Eco Expert', next: 50 };
    if (totalTrips >= 15) return { level: 3, title: 'Eco Rider', next: 25 };
    if (totalTrips >= 5) return { level: 2, title: 'Eco Beginner', next: 15 };
    return { level: 1, title: 'Eco Starter', next: 5 };
  };

  const userLevel = getLevel();
  const progressPercentage = (totalTrips / userLevel.next) * 100;

  const achievements = [
    {
      id: 1,
      title: 'Primeira Viagem',
      description: 'Complete sua primeira viagem',
      achieved: totalTrips >= 1
    },
    {
      id: 2,
      title: 'Eco Warrior',
      description: 'Economize 5kg de CO2',
      achieved: totalCO2Saved >= 5000
    },
    {
      id: 3,
      title: 'Queimador de Calorias',
      description: 'Queime 500 calorias',
      achieved: totalCalories >= 500
    },
    {
      id: 4,
      title: 'Explorador',
      description: 'Percorra 50km',
      achieved: totalDistance >= 50
    }
  ];

  return (
    <SafeAreaView style={tripHistoryStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={tripHistoryStyles.safeArea}>
        {/* Header */}
        <View style={tripHistoryStyles.header}>
          <TouchableOpacity 
            style={tripHistoryStyles.backButton}
            onPress={onNavigateBack}
          >
            <Text style={tripHistoryStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={tripHistoryStyles.headerTitle}>Histórico de Viagens</Text>
          <View style={tripHistoryStyles.placeholder} />
        </View>

        {/* Tabs */}
        <View style={tripHistoryStyles.tabsContainer}>
          <TouchableOpacity
            style={[
              tripHistoryStyles.tab,
              activeTab === 'dashboard' && tripHistoryStyles.tabActive
            ]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={[
              tripHistoryStyles.tabText,
              activeTab === 'dashboard' && tripHistoryStyles.tabTextActive
            ]}>
              Dashboard
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              tripHistoryStyles.tab,
              activeTab === 'trips' && tripHistoryStyles.tabActive
            ]}
            onPress={() => setActiveTab('trips')}
          >
            <Text style={[
              tripHistoryStyles.tabText,
              activeTab === 'trips' && tripHistoryStyles.tabTextActive
            ]}>
              Viagens
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={tripHistoryStyles.scrollContainer}>
          {activeTab === 'dashboard' ? (
            <View>
              {/* Level Progress */}
              <View style={tripHistoryStyles.levelCard}>
                <Text style={tripHistoryStyles.levelTitle}>Nível {userLevel.level}</Text>
                <Text style={tripHistoryStyles.levelSubtitle}>{userLevel.title}</Text>
                <View style={tripHistoryStyles.progressBar}>
                  <View style={[
                    tripHistoryStyles.progressFill,
                    { width: `${Math.min(progressPercentage, 100)}%` }
                  ]} />
                </View>
                <Text style={tripHistoryStyles.progressText}>
                  {totalTrips}/{userLevel.next} viagens para o próximo nível
                </Text>
              </View>

              {/* Stats Grid */}
              <View style={tripHistoryStyles.statsGrid}>
                <View style={tripHistoryStyles.statCard}>
                  <Text style={tripHistoryStyles.statNumber}>{totalTrips}</Text>
                  <Text style={tripHistoryStyles.statLabel}>Viagens</Text>
                </View>
                <View style={tripHistoryStyles.statCard}>
                  <Text style={tripHistoryStyles.statNumber}>{totalDistance.toFixed(1)}km</Text>
                  <Text style={tripHistoryStyles.statLabel}>Distância</Text>
                </View>
                <View style={tripHistoryStyles.statCard}>
                  <Text style={tripHistoryStyles.statNumber}>{formatDuration(totalDuration)}</Text>
                  <Text style={tripHistoryStyles.statLabel}>Tempo Total</Text>
                </View>
                <View style={tripHistoryStyles.statCard}>
                  <Text style={tripHistoryStyles.statNumber}>{totalCalories}</Text>
                  <Text style={tripHistoryStyles.statLabel}>Calorias</Text>
                </View>
              </View>

              {/* Environmental Impact */}
              <View style={tripHistoryStyles.impactCard}>
                <Text style={tripHistoryStyles.impactTitle}>Impacto Ambiental</Text>
                <View style={tripHistoryStyles.impactRow}>
                  <View style={tripHistoryStyles.impactInfo}>
                    <Text style={tripHistoryStyles.impactValue}>{(totalCO2Saved / 1000).toFixed(2)}kg</Text>
                    <Text style={tripHistoryStyles.impactLabel}>CO2 economizado</Text>
                  </View>
                </View>
                <Text style={tripHistoryStyles.impactDescription}>
                  Equivale a plantar {Math.floor(totalCO2Saved / 22000)} árvores
                </Text>
              </View>

              {/* Achievements */}
              <View style={tripHistoryStyles.achievementsCard}>
                <Text style={tripHistoryStyles.achievementsTitle}>Conquistas</Text>
                <View style={tripHistoryStyles.achievementsGrid}>
                  {achievements.map((achievement) => (
                    <View 
                      key={achievement.id} 
                      style={[
                        tripHistoryStyles.achievementItem,
                        achievement.achieved && tripHistoryStyles.achievementAchieved
                      ]}
                    >
                      <Text style={tripHistoryStyles.achievementTitle}>
                        {achievement.title}
                      </Text>
                      <Text style={tripHistoryStyles.achievementDescription}>
                        {achievement.description}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View>
              {/* Filters - Only show when showFilters is true */}
              {showFilters && (
                <View style={tripHistoryStyles.filtersContainer}>
                  <View style={tripHistoryStyles.filterRow}>
                    <View style={tripHistoryStyles.dateFiltersRow}>
                      <View style={tripHistoryStyles.dateFilterItem}>
                        <Text style={tripHistoryStyles.dateFilterLabel}>De:</Text>
                        <TextInput
                          style={tripHistoryStyles.filterInput}
                          value={dateFromFilter}
                          onChangeText={setDateFromFilter}
                          placeholder="AAAA-MM-DD"
                          placeholderTextColor="#999"
                        />
                      </View>

                      <View style={tripHistoryStyles.dateFilterItem}>
                        <Text style={tripHistoryStyles.dateFilterLabel}>Até:</Text>
                        <TextInput
                          style={tripHistoryStyles.filterInput}
                          value={dateToFilter}
                          onChangeText={setDateToFilter}
                          placeholder="AAAA-MM-DD"
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>

                    <View style={tripHistoryStyles.filterItem}>
                      <Text style={tripHistoryStyles.filterLabel}>Tipo de Bike:</Text>
                      <View style={tripHistoryStyles.filterButtons}>
                        <TouchableOpacity
                          style={[
                            tripHistoryStyles.filterButton,
                            bikeTypeFilter === 'all' && tripHistoryStyles.filterButtonActive
                          ]}
                          onPress={() => setBikeTypeFilter('all')}
                        >
                          <Text style={[
                            tripHistoryStyles.filterButtonText,
                            bikeTypeFilter === 'all' && tripHistoryStyles.filterButtonTextActive
                          ]}>
                            Todas
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            tripHistoryStyles.filterButton,
                            bikeTypeFilter === 'electric' && tripHistoryStyles.filterButtonActive
                          ]}
                          onPress={() => setBikeTypeFilter('electric')}
                        >
                          <Text style={[
                            tripHistoryStyles.filterButtonText,
                            bikeTypeFilter === 'electric' && tripHistoryStyles.filterButtonTextActive
                          ]}>
                            Elétrica
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            tripHistoryStyles.filterButton,
                            bikeTypeFilter === 'mechanical' && tripHistoryStyles.filterButtonActive
                          ]}
                          onPress={() => setBikeTypeFilter('mechanical')}
                        >
                          <Text style={[
                            tripHistoryStyles.filterButtonText,
                            bikeTypeFilter === 'mechanical' && tripHistoryStyles.filterButtonTextActive
                          ]}>
                            Mecânica
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={tripHistoryStyles.filterActions}>
                      <TouchableOpacity
                        style={tripHistoryStyles.clearFiltersButton}
                        onPress={() => {
                          setDateFromFilter('');
                          setDateToFilter('');
                          setBikeTypeFilter('all');
                        }}
                      >
                        <Text style={tripHistoryStyles.clearFiltersText}>Limpar Filtros</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* Trip List */}
              {filteredTrips.map((trip) => (
                <View key={trip.id} style={tripHistoryStyles.tripCard}>
                  <View style={tripHistoryStyles.tripHeader}>
                    <View style={tripHistoryStyles.tripRoute}>
                      <Text style={tripHistoryStyles.tripStation}>{trip.startStation}</Text>
                      <Text style={tripHistoryStyles.tripArrow}>→</Text>
                      <Text style={tripHistoryStyles.tripStation}>{trip.endStation}</Text>
                    </View>
                    <Text style={tripHistoryStyles.tripDate}>{formatDate(trip.date)}</Text>
                  </View>
                  
                  <View style={tripHistoryStyles.tripDetails}>
                    <View style={tripHistoryStyles.tripDetailItem}>
                      <Text style={tripHistoryStyles.tripDetailLabel}>Tipo</Text>
                      <Text style={[
                        tripHistoryStyles.tripDetailValue,
                        trip.bikeType === 'electric' ? tripHistoryStyles.electric : tripHistoryStyles.mechanical
                      ]}>
                        {trip.bikeType === 'electric' ? 'Elétrica' : 'Mecânica'}
                      </Text>
                    </View>
                    
                    <View style={tripHistoryStyles.tripDetailItem}>
                      <Text style={tripHistoryStyles.tripDetailLabel}>Tempo</Text>
                      <Text style={tripHistoryStyles.tripDetailValue}>{formatDuration(trip.duration)}</Text>
                    </View>
                    
                    <View style={tripHistoryStyles.tripDetailItem}>
                      <Text style={tripHistoryStyles.tripDetailLabel}>Distância</Text>
                      <Text style={tripHistoryStyles.tripDetailValue}>{trip.distance}km</Text>
                    </View>
                    
                    <View style={tripHistoryStyles.tripDetailItem}>
                      <Text style={tripHistoryStyles.tripDetailLabel}>Custo</Text>
                      <Text style={tripHistoryStyles.tripDetailValue}>
                        {trip.cost === 0 ? 'Grátis' : formatPrice(trip.cost)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={tripHistoryStyles.tripImpact}>
                    <View style={tripHistoryStyles.impactItem}>
                      <Text style={tripHistoryStyles.impactItemText}>
                        CO2: {(trip.co2Saved / 1000).toFixed(2)}kg
                      </Text>
                    </View>
                    <View style={tripHistoryStyles.impactItem}>
                      <Text style={tripHistoryStyles.impactItemText}>
                        Calorias: {trip.caloriesBurned}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              
              {filteredTrips.length === 0 && (
                <View style={tripHistoryStyles.emptyContainer}>
                  <Text style={tripHistoryStyles.emptyTitle}>Nenhuma viagem encontrada</Text>
                  <Text style={tripHistoryStyles.emptySubtitle}>
                    Ajuste os filtros ou faça sua primeira viagem!
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Floating Filter Button - Only show in trips tab */}
        {activeTab === 'trips' && (
          <TouchableOpacity
            style={tripHistoryStyles.floatingButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={tripHistoryStyles.floatingButtonText}>
              {showFilters ? '✕' : '⚙'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
