FROM node:20-alpine3.16 as frontend
WORKDIR /app/client
COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

