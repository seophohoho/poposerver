FROM node:18

WORKDIR /usr/src/app

COPY ../../package*.json ./
COPY ../../tsconfig.json ./
COPY ../../.env ./
COPY ../../wait-for-it.sh ./wait-for-it.sh

RUN chmod +x ./wait-for-it.sh

RUN npm install

COPY ./apps/account ./account

RUN pwd && ls -al && cd account && ls -al

CMD ["./wait-for-it.sh", "db0:5432", "--", "npm", "run", "start:account"]
