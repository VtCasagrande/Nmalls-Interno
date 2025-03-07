import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// Configuração do socket.io
const socket = io('http://localhost:5000');

const DriverLocationMap = () => {
  const [driversLocations, setDriversLocations] = useState({});
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [mapCenter, setMapCenter] = useState([-23.550520, -46.633308]); // São Paulo
  
  useEffect(() => {
    // Ouvir atualizações de localização dos motoristas
    socket.on('location:update', (data) => {
      setDriversLocations(prev => ({
        ...prev,
        [data.driverId]: {
          id: data.driverId,
          name: data.driverName,
          location: [data.latitude, data.longitude],
          lastUpdate: new Date(),
        }
      }));
      
      // Se o motorista selecionado foi atualizado, atualizar o centro do mapa
      if (selectedDriver === data.driverId) {
        setMapCenter([data.latitude, data.longitude]);
      }
    });
    
    return () => {
      socket.off('location:update');
    };
  }, [selectedDriver]);
  
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marcadores para cada motorista */}
        {Object.values(driversLocations).map(driver => (
          <Marker 
            key={driver.id}
            position={driver.location}
            eventHandlers={{
              click: () => {
                setSelectedDriver(driver.id);
              },
            }}
          >
            <Popup>
              <div>
                <h3>{driver.name}</h3>
                <p>Última atualização: {driver.lastUpdate.toLocaleTimeString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DriverLocationMap;
