FROM node:20-alpine AS builder

# Instalar dependências
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copiar código fonte e buildar
COPY . .
RUN npm run build

# Imagem de produção
FROM node:20-alpine AS runner
WORKDIR /app

# Copiar arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expor porta
EXPOSE 5173

# Iniciar aplicação
CMD ["npm", "run", "preview"]