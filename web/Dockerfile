FROM node:16-alpine AS build

# Definir argumentos de build
ARG REACT_APP_API_URL

# Configurar variáveis de ambiente
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV NODE_ENV=production
ENV CI=false

WORKDIR /app

# Copiar todo o projeto primeiro
COPY . .

# Instalar dependências
RUN npm install

# Construir a aplicação para produção
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar os arquivos de build para o diretório do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configuração para o React Router
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

# Expor a porta
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"] 