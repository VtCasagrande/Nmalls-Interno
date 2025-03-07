import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Páginas
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Deliveries from './pages/Deliveries';
import DeliveryForm from './pages/DeliveryForm';
import Drivers from './pages/Drivers';
import DriverForm from './pages/DriverForm';
import DriverTracking from './pages/DriverTracking';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Contextos
import { AuthProvider } from './contexts/AuthContext';

// Tema da aplicação
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#424242',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      // Aqui você pode adicionar uma verificação do token com o backend
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          </Route>

          {/* Rotas protegidas */}
          <Route element={<MainLayout />}>
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/entregas" element={isAuthenticated ? <Deliveries /> : <Navigate to="/login" />} />
            <Route path="/entregas/nova" element={isAuthenticated ? <DeliveryForm /> : <Navigate to="/login" />} />
            <Route path="/entregas/:id" element={isAuthenticated ? <DeliveryForm /> : <Navigate to="/login" />} />
            <Route path="/motoristas" element={isAuthenticated ? <Drivers /> : <Navigate to="/login" />} />
            <Route path="/motoristas/novo" element={isAuthenticated ? <DriverForm /> : <Navigate to="/login" />} />
            <Route path="/motoristas/:id" element={isAuthenticated ? <DriverForm /> : <Navigate to="/login" />} />
            <Route path="/rastreamento" element={isAuthenticated ? <DriverTracking /> : <Navigate to="/login" />} />
            <Route path="/perfil" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 