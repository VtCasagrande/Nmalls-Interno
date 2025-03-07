FROM node:16-alpine

# Definir argumentos de build
ARG MONGODB_URI
ARG PORT
ARG JWT_SECRET
ARG NODE_ENV

# Configurar variáveis de ambiente
ENV MONGODB_URI=${MONGODB_URI}
ENV PORT=${PORT}
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Expor a porta
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"] 