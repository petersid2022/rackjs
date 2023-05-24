FROM node:20-alpine3.16 as backend
WORKDIR /app/server
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 8082

CMD ["npm", "run", "start:dev"]

