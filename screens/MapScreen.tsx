import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { mapStyles } from './styles/mapStyles';

const { width } = Dimensions.get('window');

interface Bike {
  id: string;
  type: 'electric' | 'mechanical';
  batteryLevel?: number;
  available: boolean;
}

interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  bikes: Bike[];
  totalSlots: number;
}

interface MapScreenProps {
  onOpenSidebar: () => void;
}

const mockStations: Station[] = [
  {
    id: '1',
    name: 'Estação Paulista',
    latitude: -23.5505,
    longitude: -46.6333,
    totalSlots: 20,
    bikes: [
      { id: 'b1', type: 'electric', batteryLevel: 85, available: true },
      { id: 'b2', type: 'electric', batteryLevel: 92, available: true },
      { id: 'b3', type: 'mechanical', available: true },
      { id: 'b4', type: 'mechanical', available: true },
      { id: 'b5', type: 'electric', batteryLevel: 67, available: true },
    ]
  },
  {
    id: '2',
    name: 'Estação Vila Madalena',
    latitude: -23.5449,
    longitude: -46.6890,
    totalSlots: 15,
    bikes: [
      { id: 'b6', type: 'electric', batteryLevel: 78, available: true },
      { id: 'b7', type: 'mechanical', available: true },
      { id: 'b8', type: 'electric', batteryLevel: 45, available: true },
    ]
  },
  {
    id: '3',
    name: 'Estação Ibirapuera',
    latitude: -23.5875,
    longitude: -46.6577,
    totalSlots: 25,
    bikes: [
      { id: 'b9', type: 'electric', batteryLevel: 91, available: true },
      { id: 'b10', type: 'electric', batteryLevel: 88, available: true },
      { id: 'b11', type: 'mechanical', available: true },
      { id: 'b12', type: 'mechanical', available: true },
      { id: 'b13', type: 'electric', batteryLevel: 72, available: true },
      { id: 'b14', type: 'mechanical', available: true },
    ]
  },
  {
    id: '4',
    name: 'Estação Faria Lima',
    latitude: -23.5693,
    longitude: -46.6929,
    totalSlots: 18,
    bikes: [
      { id: 'b15', type: 'electric', batteryLevel: 95, available: true },
      { id: 'b16', type: 'mechanical', available: true },
      { id: 'b17', type: 'electric', batteryLevel: 82, available: true },
      { id: 'b18', type: 'mechanical', available: true },
    ]
  },
  {
    id: '5',
    name: 'Estação Liberdade',
    latitude: -23.5587,
    longitude: -46.6347,
    totalSlots: 12,
    bikes: [
      { id: 'b19', type: 'electric', batteryLevel: 73, available: true },
      { id: 'b20', type: 'electric', batteryLevel: 89, available: true },
      { id: 'b21', type: 'mechanical', available: true },
    ]
  },
  {
    id: '6',
    name: 'Estação Brooklin',
    latitude: -23.6108,
    longitude: -46.7022,
    totalSlots: 16,
    bikes: [
      { id: 'b22', type: 'electric', batteryLevel: 66, available: true },
      { id: 'b23', type: 'mechanical', available: true },
      { id: 'b24', type: 'electric', batteryLevel: 94, available: true },
      { id: 'b25', type: 'mechanical', available: true },
      { id: 'b26', type: 'electric', batteryLevel: 81, available: true },
    ]
  },
];

export const MapScreen: React.FC<MapScreenProps> = ({ onOpenSidebar }) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [bikeNumber, setBikeNumber] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const openStationDetails = (station: Station) => {
    setSelectedStation(station);
    setShowStationModal(true);
  };

  const startTrip = () => {
    setShowTripModal(true);
    setShowStationModal(false);
  };

  const confirmTrip = () => {
    setShowTripModal(false);
    // Aqui você implementaria a lógica para iniciar a viagem
  };

  const openQRScanner = () => {
    setShowQRModal(true);
    // Simular escaneamento de QR Code
    setTimeout(() => {
      const randomBikeNumber = `B${Math.floor(Math.random() * 9000) + 1000}`;
      setBikeNumber(randomBikeNumber);
      setShowQRModal(false);
      generatePin(randomBikeNumber);
    }, 2000);
  };

  const openPinInput = () => {
    setShowPinModal(true);
  };

  const generatePin = (bikeNum: string) => {
    const pin = Math.floor(Math.random() * 9000) + 1000;
    setGeneratedPin(pin.toString());
    Alert.alert(
      'PIN Gerado',
      `Bike: ${bikeNum}\nPIN: ${pin}\n\nDigite este PIN no painel da bike para desbloqueá-la.`,
      [
        { text: 'OK', onPress: () => setShowTripModal(true) }
      ]
    );
  };

  const handleManualBikeInput = () => {
    if (bikeNumber.trim()) {
      setShowPinModal(false);
      generatePin(bikeNumber);
    } else {
      Alert.alert('Erro', 'Por favor, digite o número da bike.');
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return '#4CAF50';
    if (level > 30) return '#FF9800';
    return '#F44336';
  };

  return (
    <SafeAreaView style={mapStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={mapStyles.safeArea}>
        {/* Header */}
        <View style={mapStyles.header}>
          <TouchableOpacity
            style={mapStyles.menuButton}
            onPress={onOpenSidebar}
          >
            <Text style={mapStyles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={mapStyles.headerTitle}>Bike Itaú</Text>
          <View style={mapStyles.placeholder} />
        </View>

        {/* Map */}
        <View style={mapStyles.mapContainer}>
          {!mapReady && (
            <View style={mapStyles.loadingContainer}>
              <Text style={mapStyles.loadingText}>Carregando mapa...</Text>
            </View>
          )}
          <MapView
            style={mapStyles.map}
            initialRegion={{
              latitude: -23.5505,
              longitude: -46.6333,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
            loadingIndicatorColor="#FF6600"
            loadingBackgroundColor="#f5f5f5"
            mapType="standard"
            onMapReady={() => {
              console.log('Map is ready');
              setMapReady(true);
            }}
          >
            {/* Marcadores das estações */}
            {mockStations.map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.latitude,
                  longitude: station.longitude,
                }}
                onPress={() => openStationDetails(station)}
                title={station.name}
                description={`${station.bikes.length} bikes disponíveis`}
              >
                <View style={mapStyles.customMarker}>
                  <View style={mapStyles.markerIcon}>
                    <Text style={mapStyles.markerText}>🚲</Text>
                  </View>
                  <View style={mapStyles.markerBadge}>
                    <Text style={mapStyles.markerBadgeText}>{station.bikes.length}</Text>
                  </View>
                </View>
              </Marker>
            ))}
          </MapView>
        {/* Marcadores comentados temporariamente */}
        {/* {mockStations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            onPress={() => openStationDetails(station)}
          >
            <View style={mapStyles.markerContainer}>
              <View style={mapStyles.marker}>
                <Text style={mapStyles.markerText}>{station.bikes.length}</Text>
              </View>
              <Text style={mapStyles.stationName}>{station.name}</Text>
            </View>
          </Marker>
        ))} */}
          {/* </MapView> */}
        </View>

        {/* Botões Flutuantes para Iniciar Viagem */}
        <View style={mapStyles.floatingButtonContainer}>
          <TouchableOpacity
            style={mapStyles.floatingButton}
            onPress={openQRScanner}
          >
            <Text style={mapStyles.floatingButtonText}>📱</Text>
            <Text style={mapStyles.floatingButtonLabel}>QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[mapStyles.floatingButton, mapStyles.floatingButtonSecondary]}
            onPress={openPinInput}
          >
            <Text style={mapStyles.floatingButtonText}>🔢</Text>
            <Text style={mapStyles.floatingButtonLabel}>PIN</Text>
          </TouchableOpacity>
        </View>

      {/* Station Details Modal */}
      <Modal
        visible={showStationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStationModal(false)}
      >
        <View style={mapStyles.modalOverlay}>
          <View style={mapStyles.modalContent}>
            <View style={mapStyles.modalHeader}>
              <Text style={mapStyles.modalTitle}>
                {selectedStation?.name}
              </Text>
              <TouchableOpacity
                onPress={() => setShowStationModal(false)}
                style={mapStyles.closeButton}
              >
                <Text style={mapStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={mapStyles.modalBody}>
              <View style={mapStyles.stationInfo}>
                <Text style={mapStyles.infoText}>
                  Bikes disponíveis: {selectedStation?.bikes.length}
                </Text>
                <Text style={mapStyles.infoText}>
                  Vagas totais: {selectedStation?.totalSlots}
                </Text>
              </View>

              <Text style={mapStyles.bikesTitle}>Bikes Disponíveis:</Text>
              
              {selectedStation?.bikes.map((bike) => (
                <View key={bike.id} style={mapStyles.bikeItem}>
                  <View style={mapStyles.bikeInfo}>
                    <Text style={mapStyles.bikeId}>#{bike.id}</Text>
                    <Text style={[
                      mapStyles.bikeType,
                      bike.type === 'electric' ? mapStyles.electric : mapStyles.mechanical
                    ]}>
                      {bike.type === 'electric' ? 'Elétrica' : 'Mecânica'}
                    </Text>
                  </View>
                  
                  {bike.type === 'electric' && bike.batteryLevel && (
                    <View style={mapStyles.batteryContainer}>
                      <Text style={mapStyles.batteryText}>
                        Bateria: {bike.batteryLevel}%
                      </Text>
                      <View style={mapStyles.batteryBar}>
                        <View 
                          style={[
                            mapStyles.batteryFill,
                            { 
                              width: `${bike.batteryLevel}%`,
                              backgroundColor: getBatteryColor(bike.batteryLevel)
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={mapStyles.startTripButton}
              onPress={startTrip}
            >
              <Text style={mapStyles.startTripButtonText}>Iniciar Viagem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Trip Confirmation Modal */}
      <Modal
        visible={showTripModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTripModal(false)}
      >
        <View style={mapStyles.modalOverlay}>
          <View style={mapStyles.tripModalContent}>
            <Text style={mapStyles.tripModalTitle}>Confirmar Viagem</Text>
            <Text style={mapStyles.tripModalText}>
              Deseja iniciar uma viagem na {selectedStation?.name}?
            </Text>
            
            <View style={mapStyles.tripModalButtons}>
              <TouchableOpacity
                style={mapStyles.cancelButton}
                onPress={() => setShowTripModal(false)}
              >
                <Text style={mapStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={mapStyles.confirmButton}
                onPress={confirmTrip}
              >
                <Text style={mapStyles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de QR Code Scanner */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
      >
        <View style={mapStyles.modalOverlay}>
          <View style={mapStyles.modalContent}>
            <View style={mapStyles.modalHeader}>
              <Text style={mapStyles.modalTitle}>Escaneando QR Code</Text>
              <TouchableOpacity
                style={mapStyles.closeButton}
                onPress={() => setShowQRModal(false)}
              >
                <Text style={mapStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={mapStyles.modalBody}>
              <View style={mapStyles.qrScannerContainer}>
                <Text style={mapStyles.qrScannerText}>
                  📱 Aponte a câmera para o QR Code da bike
                </Text>
                <View style={mapStyles.qrScannerFrame}>
                  <Text style={mapStyles.scanningText}>Escaneando...</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Input PIN */}
      <Modal
        visible={showPinModal}
        transparent={true}
        animationType="slide"
      >
        <View style={mapStyles.modalOverlay}>
          <View style={mapStyles.modalContent}>
            <View style={mapStyles.modalHeader}>
              <Text style={mapStyles.modalTitle}>Digite o Número da Bike</Text>
              <TouchableOpacity
                style={mapStyles.closeButton}
                onPress={() => setShowPinModal(false)}
              >
                <Text style={mapStyles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={mapStyles.modalBody}>
              <Text style={mapStyles.pinInputLabel}>
                Digite o número da bike que você deseja usar:
              </Text>
              <TextInput
                style={mapStyles.pinInput}
                value={bikeNumber}
                onChangeText={setBikeNumber}
                placeholder="Ex: B1234"
                placeholderTextColor="#999"
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={mapStyles.generatePinButton}
                onPress={handleManualBikeInput}
              >
                <Text style={mapStyles.generatePinButtonText}>Gerar PIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};
