FROM node:17.5

WORKDIR /api/

ENV expiry=300

COPY src/ src/
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

CMD ["npm", "start"]
