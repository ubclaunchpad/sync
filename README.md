# Sync Along
[![Build Status](https://travis-ci.com/ubclaunchpad/sync.svg?branch=master)](https://travis-ci.com/ubclaunchpad/sync)

Sync is an interactive streaming site where you can watch YouTube videos synchronously with others. 

## Dependencies
- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/) (optional)

## Setup

### Locally
#### Frontend
- `npm install` to install all dependencies 
- `npm start` to build & start the React app

#### Backend
- `npm install` to install all dependencies
- `npm start` to build & start the Node.js server
 
### Docker
- `docker-compose up` to spin up the frontend, backend, and Redis containers
