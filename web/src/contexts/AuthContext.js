import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Criar o contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Configurar o token no cabeçalho das requisições
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obter informações do usuário
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`);
          
          setUser(response.data);
          setError(null);
        } catch (err) {
          console.error('Erro ao verificar autenticação:', err);
          logout();
          setError('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      // Configurar o token no cabeçalho das requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setError(null);
      
      return true;
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Valores a serem disponibilizados pelo contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 