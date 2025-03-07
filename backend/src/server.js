const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

// Criar aplicação Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'API NmallsInterno funcionando!' });
});

// Configuração do Socket.io para rastreamento em tempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  // Ouvir atualizações de localização dos motoristas
  socket.on('driver:location', (data) => {
    // Salvar localização no banco de dados e emitir para os clientes
    console.log('Localização do motorista atualizada:', data);
    
    // Emitir a localização para todos os clientes conectados
    io.emit('location:update', data);
  });
  
  // Ouvir atualizações de status das entregas
  socket.on('delivery:status', (data) => {
    console.log('Status da entrega atualizado:', data);
    // Atualizar no banco de dados
    
    // Emitir para todos os clientes
    io.emit('delivery:statusUpdate', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro no servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = app;
