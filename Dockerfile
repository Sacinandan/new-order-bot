FROM node:16.13.1-alpine AS client

WORKDIR /src/client

COPY ./src/client/package.json   ./package.json

RUN npm i

COPY ./src/client/public         ./public
COPY ./src/client/src            ./src
COPY ./src/client/tsconfig.json  ./tsconfig.json

RUN npm run build

FROM node:16.13.1-alpine AS server

WORKDIR .

COPY --from=client /src/client/build /src/client/build

COPY ./package.json             ./package.json

RUN npm i

COPY ./prisma                   ./prisma
COPY ./src/bots                 ./src/bots
COPY ./src/database             ./src/database
COPY ./src/server               ./src/server
COPY ./index.js                 ./index.js

RUN npx prisma generate

ENV PORT=8000
EXPOSE $PORT

CMD ["node", "index.js"]
