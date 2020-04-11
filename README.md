# Sync
[![Build Status](https://travis-ci.com/ubclaunchpad/sync.svg?branch=master)](https://travis-ci.com/ubclaunchpad/sync)

Sync is a synchronous YouTube streaming app for you to watch, share, and talk about videos with your friends. Chat and video call your friends, and create endless playlists to watch videos together.

## Dependencies
- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/) (optional)

## Setup

### Locally
#### Frontend
- `npm install` to install all dependencies 
- `npm run dev` to build & start the React app

#### Backend
- `npm install` to install all dependencies
- `npm run dev` to build & start the Node.js server
 
### Docker
- `docker-compose up` to spin up the frontend, backend, and Redis containers
