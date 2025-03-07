FROM node:16-alpine as build

# Definir argumentos de build
ARG REACT_APP_API_URL

# Configurar variáveis de ambiente
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV NODE_ENV=production

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação para produção
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar os arquivos de build para o diretório do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração personalizada do Nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"] 