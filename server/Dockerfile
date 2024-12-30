FROM node:alpine

WORKDIR /Server

COPY package*.json .
RUN npm install
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]