FROM node:20
WORKDIR /usr/src/app
VOLUME /usr/src/app/assets/resultados
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "main.js"]
