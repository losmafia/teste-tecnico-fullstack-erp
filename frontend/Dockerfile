FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta do frontend
EXPOSE 3000

# O Next.js rodará em modo dev para este teste
# Em produção real, você rodaria npm run build && npm run start
CMD ["npm", "run", "dev"]
