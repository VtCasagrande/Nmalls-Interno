import * as Location from 'expo-location';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do socket.io
const socket = io('http://localhost:5000');

class LocationService {
  constructor() {
    this.watchId = null;
    this.isTracking = false;
    this.userId = null;
    this.userName = null;
  }

  async init() {
    try {
      // Obter permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de localização negada');
      }

      // Recuperar dados do usuário
      this.userId = await AsyncStorage.getItem('userId');
      this.userName = await AsyncStorage.getItem('userName');

      return true;
    } catch (error) {
      console.error('Erro ao inicializar serviço de localização:', error);
      return false;
    }
  }

  async startTracking() {
    if (this.isTracking) return;

    try {
      await this.init();

      // Iniciar rastreamento de localização
      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        this.handleLocationUpdate
      );

      this.isTracking = true;
      console.log('Rastreamento de localização iniciado');
      return true;
    } catch (error) {
      console.error('Erro ao iniciar rastreamento:', error);
      return false;
    }
  }

  stopTracking() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
      this.isTracking = false;
      console.log('Rastreamento de localização parado');
    }
  }

  handleLocationUpdate = (location) => {
    const { latitude, longitude } = location.coords;
    
    // Enviar atualização para o servidor via socket.io
    socket.emit('driver:location', {
      driverId: this.userId,
      driverName: this.userName,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    });
    
    console.log(`Localização atualizada: ${latitude}, ${longitude}`);
  }
}

export default new LocationService();
