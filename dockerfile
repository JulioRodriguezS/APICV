FROM node:8.1
WORKDIR /home/julios/Documents/Proyects/DockerImages/API-CV
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","start"]