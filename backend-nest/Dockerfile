FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN npm run build
ENV PORT=8080
EXPOSE 8080
CMD ["node","dist/main.js"]
