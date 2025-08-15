import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { mapStyles } from './styles/mapStyles';

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
    bikes: [
      { id: 'B001', type: 'electric', batteryLevel: 85, available: true },
      { id: 'B002', type: 'mechanical', available: true },
    ],
    totalSlots: 10,
  },
  {
    id: '2',
    name: 'Estação Vila Madalena',
    latitude: -23.5449,
    longitude: -46.6890,
    bikes: [
      { id: 'B003', type: 'electric', batteryLevel: 92, available: true },
    ],
    totalSlots: 8,
  },
];

export const MapScreen: React.FC<MapScreenProps> = ({ onOpenSidebar }) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [bikeNumber, setBikeNumber] = useState('');
  const [hasLocation, setHasLocation] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasLocation(status === 'granted');
      } catch (error) {
        console.log('Error requesting location permission:', error);
        setHasLocation(false);
      }
    })();
  }, []);

  const openStationDetails = (station: Station) => {
    setSelectedStation(station);
    setShowStationModal(true);
  };

  const closeStationModal = () => {
    setShowStationModal(false);
    setSelectedStation(null);
  };

  const openQRScanner = () => {
    setShowQRModal(true);
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
    Alert.alert(
      'PIN Gerado',
      `Bike: ${bikeNum}\nPIN: ${pin}\n\nDigite este PIN no painel da bike para desbloqueá-la.`,
      [{ text: 'OK' }]
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

  // Evita montar o mapa até saber a permissão (previne crash)
  if (hasLocation === null) {
    return (
      <SafeAreaView style={mapStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
        <View style={mapStyles.safeArea}>
          {/* Header */}
          <View style={mapStyles.header}>
            <TouchableOpacity style={mapStyles.menuButton} onPress={onOpenSidebar}>
              <Text style={mapStyles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={mapStyles.headerTitle}>Bike Itaú</Text>
            <View style={mapStyles.placeholder} />
          </View>
          <View style={[mapStyles.mapContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text>Carregando mapa...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const region = {
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={mapStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      <View style={mapStyles.safeArea}>
        {/* Header */}
        <View style={mapStyles.header}>
          <TouchableOpacity style={mapStyles.menuButton} onPress={onOpenSidebar}>
            <Text style={mapStyles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={mapStyles.headerTitle}>Bike Itaú</Text>
          <View style={mapStyles.placeholder} />
        </View>

        {/* Map */}
        <View style={mapStyles.mapContainer}>
          <MapView
            style={mapStyles.map}
            // Em Android use Google provider; em iOS deixe undefined (a menos que tenha Dev Client configurado)
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            showsUserLocation={hasLocation}
            showsMyLocationButton={hasLocation && Platform.OS === 'android'}
            mapType="standard"
            onMapReady={() => console.log('Map is ready')}
          >
            {mockStations.map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: Number(station.latitude),
                  longitude: Number(station.longitude),
                }}
                title={station.name}
                description={`${station.bikes.length} bikes disponíveis`}
                onPress={() => openStationDetails(station)}
              />
            ))}
          </MapView>
        </View>

        {/* Floating Buttons */}
        <View style={mapStyles.floatingButtonContainer}>
          <TouchableOpacity style={mapStyles.floatingButton} onPress={openQRScanner}>
            <Text style={mapStyles.floatingButtonText}>QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[mapStyles.floatingButton, mapStyles.floatingButtonSecondary]}
            onPress={openPinInput}
          >
            <Text style={mapStyles.floatingButtonText}>PIN</Text>
          </TouchableOpacity>
        </View>

        {/* Station Modal */}
        <Modal visible={showStationModal} transparent={true} animationType="slide">
          <View style={mapStyles.modalOverlay}>
            <View style={mapStyles.modalContent}>
              <View style={mapStyles.modalHeader}>
                <Text style={mapStyles.modalTitle}>{selectedStation?.name}</Text>
                <TouchableOpacity style={mapStyles.closeButton} onPress={closeStationModal}>
                  <Text style={mapStyles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={mapStyles.modalBody}>
                <Text>Bikes disponíveis: {selectedStation?.bikes.length}</Text>
                <Text>Total de vagas: {selectedStation?.totalSlots}</Text>
              </View>
            </View>
          </View>
        </Modal>

        {/* QR Modal */}
        <Modal visible={showQRModal} transparent={true} animationType="fade">
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
                    Aponte a câmera para o QR Code da bike
                  </Text>
                  <View style={mapStyles.qrScannerFrame}>
                    <View style={mapStyles.cameraView}>
                      <Text style={mapStyles.scanningText}>Escaneando QR Code...</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* PIN Modal */}
        <Modal visible={showPinModal} transparent={true} animationType="slide">
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
