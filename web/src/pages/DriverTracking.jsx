import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import DriverLocationMap from '../components/DriverLocationMap';
import axios from 'axios';

const DriverTracking = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Carregar motoristas ativos
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('/api/users?role=driver&active=true');
        setDrivers(response.data);
      } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    // Carregar entregas do motorista selecionado
    if (selectedDriver) {
      const fetchDeliveries = async () => {
        try {
          const response = await axios.get(`/api/deliveries?driver=${selectedDriver}`);
          setDeliveries(response.data);
        } catch (error) {
          console.error('Erro ao carregar entregas:', error);
        }
      };

      fetchDeliveries();
    }
  }, [selectedDriver]);

  return (
    <Box className="p-4">
      <Typography variant="h5" className="mb-4">
        Rastreamento de Motoristas
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-2">
                Motoristas Ativos
              </Typography>
              {/* Lista de motoristas */}
              {drivers.map((driver) => (
                <Box
                  key={driver._id}
                  className="p-2 mb-2 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedDriver(driver._id)}
                  style={{
                    backgroundColor:
                      selectedDriver === driver._id ? '#e6f2ff' : 'transparent',
                  }}
                >
                  <Typography variant="body1">{driver.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {driver.vehicle || 'Veículo não informado'}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {selectedDriver && (
            <Card className="mt-3">
              <CardContent>
                <Typography variant="h6" className="mb-2">
                  Entregas Ativas
                </Typography>
                {deliveries.map((delivery) => (
                  <Box key={delivery._id} className="p-2 mb-2 border-b">
                    <Typography variant="body1">
                      #{delivery._id.substring(0, 6)} • {delivery.customer.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {delivery.address.street}, {delivery.address.number}
                    </Typography>
                    <Typography variant="body2">
                      Status: {delivery.status}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              <DriverLocationMap selectedDriver={selectedDriver} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverTracking;
