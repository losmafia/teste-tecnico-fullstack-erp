FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o schema do Prisma e gera o cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copia o resto do código
COPY . .

# Expõe a porta do backend
EXPOSE 3333

# Comando para rodar a aplicação em modo de desenvolvimento
# Em um ambiente real de produção, você compilaria (tsc) e rodaria node dist/server.js
CMD ["npm", "run", "dev"]
