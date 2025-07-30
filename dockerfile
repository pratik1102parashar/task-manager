FROM node:18

WORKDIR /app

#install netcat-openbsd (not virtual 'netcat' package)
RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

EXPOSE 3000

CMD ["wait-for-it.sh", "taskmanager-mysql:3306", "--", "npm", "run", "dev"]
