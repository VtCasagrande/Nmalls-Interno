import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  Person as DriverIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  DirectionsCar as InTransitIcon
} from '@mui/icons-material';
import axios from 'axios';

// Componente para exibir estatísticas
const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" component="div" sx={{ textAlign: 'center', my: 2 }}>
        {value}
      </Typography>
    </CardContent>
    <Divider />
    <CardActions>
      <Button size="small" onClick={onClick}>Ver detalhes</Button>
    </CardActions>
  </Card>
);

// Componente para exibir entregas recentes
const RecentDeliveries = ({ deliveries, loading, onViewDetails }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Entregas Recentes
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ width: '100%' }}>
          {deliveries.length > 0 ? (
            deliveries.map((delivery) => (
              <React.Fragment key={delivery._id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(delivery.status) }}>
                      {getStatusIcon(delivery.status)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={delivery.customer.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {`${delivery.address.street}, ${delivery.address.number}`}
                        </Typography>
                        {` — ${getStatusText(delivery.status)}`}
                      </>
                    }
                  />
                  <Button size="small" onClick={() => onViewDetails(delivery._id)}>
                    Detalhes
                  </Button>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Nenhuma entrega recente encontrada.
            </Typography>
          )}
        </List>
      )}
    </CardContent>
    <Divider />
    <CardActions>
      <Button size="small" onClick={() => onViewDetails()}>Ver todas</Button>
    </CardActions>
  </Card>
);

// Funções auxiliares para status
const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return '#4caf50';
    case 'in_transit':
      return '#2196f3';
    case 'pending':
    case 'assigned':
      return '#ff9800';
    case 'cancelled':
      return '#f44336';
    default:
      return '#757575';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered':
      return <CompletedIcon />;
    case 'in_transit':
      return <InTransitIcon />;
    case 'pending':
    case 'assigned':
      return <PendingIcon />;
    default:
      return <DeliveryIcon />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'delivered':
      return 'Entregue';
    case 'in_transit':
      return 'Em trânsito';
    case 'pending':
      return 'Pendente';
    case 'assigned':
      return 'Atribuída';
    case 'cancelled':
      return 'Cancelada';
    default:
      return status;
  }
};

function Dashboard() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    activeDrivers: 0
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Em um cenário real, você faria uma chamada à API
        // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard`);
        // setStats(response.data.stats);
        // setRecentDeliveries(response.data.recentDeliveries);
        
        // Dados de exemplo para demonstração
        setTimeout(() => {
          setStats({
            totalDeliveries: 156,
            pendingDeliveries: 23,
            completedDeliveries: 133,
            activeDrivers: 12
          });
          
          setRecentDeliveries([
            {
              _id: '1',
              customer: { name: 'João Silva' },
              address: { street: 'Av. Paulista', number: '1000' },
              status: 'delivered',
              createdAt: new Date().toISOString()
            },
            {
              _id: '2',
              customer: { name: 'Maria Oliveira' },
              address: { street: 'Rua Augusta', number: '500' },
              status: 'in_transit',
              createdAt: new Date().toISOString()
            },
            {
              _id: '3',
              customer: { name: 'Pedro Santos' },
              address: { street: 'Av. Brigadeiro Faria Lima', number: '2000' },
              status: 'pending',
              createdAt: new Date().toISOString()
            }
          ]);
          
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleViewDeliveries = (status) => {
    if (status) {
      navigate(`/entregas?status=${status}`);
    } else {
      navigate('/entregas');
    }
  };

  const handleViewDrivers = () => {
    navigate('/motoristas');
  };

  const handleViewDeliveryDetails = (id) => {
    if (id) {
      navigate(`/entregas/${id}`);
    } else {
      navigate('/entregas');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total de Entregas" 
            value={loading ? <CircularProgress size={40} /> : stats.totalDeliveries} 
            icon={<DeliveryIcon />} 
            color="#1976d2"
            onClick={() => handleViewDeliveries()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Entregas Pendentes" 
            value={loading ? <CircularProgress size={40} /> : stats.pendingDeliveries} 
            icon={<PendingIcon />} 
            color="#ff9800"
            onClick={() => handleViewDeliveries('pending')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Entregas Concluídas" 
            value={loading ? <CircularProgress size={40} /> : stats.completedDeliveries} 
            icon={<CompletedIcon />} 
            color="#4caf50"
            onClick={() => handleViewDeliveries('delivered')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Motoristas Ativos" 
            value={loading ? <CircularProgress size={40} /> : stats.activeDrivers} 
            icon={<DriverIcon />} 
            color="#9c27b0"
            onClick={handleViewDrivers}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RecentDeliveries 
            deliveries={recentDeliveries} 
            loading={loading}
            onViewDetails={handleViewDeliveryDetails}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Ações Rápidas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<DeliveryIcon />}
                    onClick={() => navigate('/entregas/nova')}
                  >
                    Nova Entrega
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<DriverIcon />}
                    onClick={() => navigate('/motoristas/novo')}
                  >
                    Novo Motorista
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    fullWidth 
                    onClick={() => navigate('/rastreamento')}
                  >
                    Rastreamento em Tempo Real
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 