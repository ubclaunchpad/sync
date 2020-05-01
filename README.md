<h1 align="center">Sync</h1>

<p align="center">
  <a href="https://github.com/ubclaunchpad/sync/actions?workflow=Checks">
    <img src="https://github.com/ubclaunchpad/sync/workflows/Checks/badge.svg"
      alt="Checks Status" />
  </a>
  <a href="https://app.netlify.com/sites/ubclaunchpad-sync/deploys">
    <img src="https://api.netlify.com/api/v1/badges/d9fa8627-6e3d-4ab9-91ac-859bdb63f5b8/deploy-status"
      alt="Netlify Status" />
  </a>
</p>

Sync is a synchronous YouTube streaming app for you to watch, share, and talk about videos with your friends. Create stream rooms with your friends. Chat and video call your friends and create endless playlists to watch videos together.

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
- ensure Redis server is running
- `npm install` to install all dependencies
- `npm start` to build & start the Node.js server
 
### Docker
- `docker-compose up` to spin up the frontend, backend, and Redis containers
