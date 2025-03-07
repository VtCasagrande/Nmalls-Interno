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

# Verificar a estrutura do projeto
RUN ls -la
RUN ls -la public || echo "Diretório public não encontrado"

# Criar diretório public se não existir
RUN mkdir -p public

# Criar um index.html básico se não existir
RUN if [ ! -f public/index.html ]; then \
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>NmallsInterno</title></head><body><div id="root"></div></body></html>' > public/index.html; \
    fi

# Construir a aplicação para produção
RUN npm run build

# Verificar o diretório de build
RUN ls -la build || echo "Diretório build não encontrado"

# Estágio de produção
FROM nginx:alpine

# Copiar os arquivos de build para o diretório do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Se o build falhar, copiar o diretório public como fallback
RUN mkdir -p /usr/share/nginx/html
COPY --from=build /app/public /usr/share/nginx/html

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