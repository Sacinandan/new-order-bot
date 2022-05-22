# New Order Alliance Organizer ![version](https://img.shields.io/badge/version-1.8.0-blue.svg)

## Discord bot for Lineage II community

L2Reborn x1 Interlude. New Order alliance

[L2Reborn](https://l2reborn.org/)

## Quick Start

<img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" class="d-block rounded-1 mr-3 flex-shrink-0" alt="javascript logo" width="64" height="64"> <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" class="d-block rounded-1 mr-3 flex-shrink-0" alt="node.js logo" width="64" height="64"> <img src="https://avatars.githubusercontent.com/u/26492485?s=64&v=4" class="d-block rounded-1 mr-3 flex-shrink-0" alt="discord logo" width="64" height="64"> <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/postgresql/postgresql.png" class="d-block rounded-1 mr-3 flex-shrink-0" alt="postgresql logo" width="64" height="64"> <img src="https://avatars.githubusercontent.com/u/17219288?s=200&v=4" class="d-block rounded-1 mr-3 flex-shrink-0" alt="prisma logo" width="64" height="64"> <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/express/express.png" class="d-block rounded-1 mr-3 flex-shrink-0" alt="express logo" width="64" height="64"> <img src="https://avatars.githubusercontent.com/u/5429470?s=200&v=4" class="d-block rounded-1 mr-3 flex-shrink-0" alt="docker logo" width="64" height="64">

### Run the bot in development mode:

1. Install [NodeJS](https://nodejs.org)

2. Run command `npm i`

3. Change values of variables in the file `.env`

4. Run command `npx prisma generate`

5. Run command `npx prisma migrate dev --name init`

6. Run command `npm run dev`

### Build and run the bot in production mode:

1. Install [Docker](https://www.docker.com)

2. Change values of variables in the file `docker-compose.yml`

3. Run command `docker-compose up`

### Deploy to Heroku:

1. Create APP on [Heroku](https://heroku.com)

2. Install Heroku CLI

3. Run `heroku stack:set container -a your-app-name`

4. Change values of variables in the file `heroku.yml`

5. Connect your GitHub repo and deploy the bot

## License

[MIT licensed](LICENSE)
