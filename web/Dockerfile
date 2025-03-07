FROM node:16-alpine

# Definir argumentos de build
ARG REACT_APP_API_URL

# Configurar variáveis de ambiente
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação em desenvolvimento
CMD ["npm", "start"] 