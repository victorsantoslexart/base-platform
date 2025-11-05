FROM node:24.2.0-alpine3.21

WORKDIR /app

RUN addgroup -S nodeuser && adduser -S nodeuser -G nodeuser

COPY package*.json ./

RUN chown -R nodeuser:nodeuser /app

USER nodeuser

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]