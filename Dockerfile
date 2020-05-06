FROM node:12.16.3
WORKDIR /usr/src/
COPY package*.json ./

RUN npm install

RUN cd ../
COPY . .
EXPOSE $PORT 
CMD ["node", "./server/server.js"]
