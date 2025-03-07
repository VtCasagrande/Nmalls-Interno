FROM nginx:alpine

# Criar diretório para os arquivos estáticos
WORKDIR /usr/share/nginx/html

# Limpar o diretório padrão
RUN rm -rf ./*

# Criar um arquivo index.html básico
RUN echo '<!DOCTYPE html>\n\
<html lang="pt-BR">\n\
<head>\n\
    <meta charset="UTF-8">\n\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
    <title>NmallsInterno</title>\n\
    <style>\n\
        body {\n\
            font-family: Arial, sans-serif;\n\
            margin: 0;\n\
            padding: 0;\n\
            display: flex;\n\
            justify-content: center;\n\
            align-items: center;\n\
            height: 100vh;\n\
            background-color: #f5f5f5;\n\
            color: #333;\n\
        }\n\
        .container {\n\
            text-align: center;\n\
            padding: 2rem;\n\
            background-color: white;\n\
            border-radius: 8px;\n\
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n\
            max-width: 600px;\n\
        }\n\
        h1 {\n\
            color: #2c3e50;\n\
        }\n\
        p {\n\
            margin: 1rem 0;\n\
            line-height: 1.6;\n\
        }\n\
        .status {\n\
            padding: 0.5rem 1rem;\n\
            background-color: #e7f4ff;\n\
            border-radius: 4px;\n\
            display: inline-block;\n\
            margin: 1rem 0;\n\
        }\n\
    </style>\n\
</head>\n\
<body>\n\
    <div class="container">\n\
        <h1>NmallsInterno</h1>\n\
        <div class="status" id="status">Verificando conexão com a API...</div>\n\
        <p>Sistema de gerenciamento de rotas internas para motoristas.</p>\n\
        <p>Esta é uma página temporária. O frontend completo está em desenvolvimento.</p>\n\
    </div>\n\
    <script>\n\
        // Função para verificar a conexão com a API\n\
        async function checkApiConnection() {\n\
            const statusElement = document.getElementById("status");\n\
            try {\n\
                const apiUrl = "http://nmalls_nmallsinterno-api:5000";\n\
                const response = await fetch(apiUrl);\n\
                if (response.ok) {\n\
                    const data = await response.json();\n\
                    statusElement.textContent = "API conectada com sucesso: " + data.message;\n\
                    statusElement.style.backgroundColor = "#e6ffe6";\n\
                } else {\n\
                    statusElement.textContent = "API encontrada, mas retornou erro: " + response.status;\n\
                    statusElement.style.backgroundColor = "#fff0e0";\n\
                }\n\
            } catch (error) {\n\
                statusElement.textContent = "Erro ao conectar com a API: " + error.message;\n\
                statusElement.style.backgroundColor = "#ffe6e6";\n\
            }\n\
        }\n\
        \n\
        // Verificar a conexão quando a página carregar\n\
        window.addEventListener("load", checkApiConnection);\n\
    </script>\n\
</body>\n\
</html>' > index.html

# Configuração para o Nginx
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