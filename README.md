<h1 align="center">Sync</h1>

<p align="center">
  <a href="https://www.producthunt.com/posts/sync-4?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-sync-4" target="_blank">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=272894&theme=dark" alt="Sync | Product Hunt" style="width: 190px; height: 44px;" width="190" height="44" />
  </a>
  <br>
  <a href="https://github.com/ubclaunchpad/sync/actions?workflow=Checks">
    <img src="https://github.com/ubclaunchpad/sync/workflows/Checks/badge.svg"
      alt="Checks Status" />
  </a>
  <a href="https://app.netlify.com/sites/ubclaunchpad-sync/deploys">
    <img src="https://api.netlify.com/api/v1/badges/d9fa8627-6e3d-4ab9-91ac-859bdb63f5b8/deploy-status"
      alt="Netlify Status" />
  </a>
</p>
<p align="center">
  <a href="https://youtu.be/Y143tZxDp2A">
    <img width="50%" src="https://raw.githubusercontent.com/ubclaunchpad/sync/master/.static/banner.png" />
  </a>
</p>

___NOTE: This project is no longer actively maintained.___

Sync is a synchronous YouTube streaming app for you to watch, share, and talk about videos with your friends. Create stream rooms with your friends. Chat and video call your friends and create endless playlists to watch videos together.

## Contributing

### Dependencies
To get started, install the following dependencies: 
- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/) (optional)

### Frontend
The frontend is a React app in the *frontend* directory. Run `npm install` to install all project dependencies. Run `npm run dev` to start the React development server. The *Launch & Debug Chrome (Frontend)* launch configuration can be used to attach a debugger to the React process and debug from VS Code.

### Backend
The backend is a Node.js Express server in the *backend* directory. Run `npm install` to install all project dependencies. Before starting the backend, start Redis server. Run `npm run dev` to start the Node.js server. It auto restarts the process on code changes. The *Attach Debugger (Backend)* launch configuration can be used to attach a debugger to the running process. Use the *Launch & Debug (Backend)* launch configuration to launch the Node process and attach a debugger from VS Code.
 
### Docker
The development environment can be run all through Docker. Simply run `docker-compose up` to spin up the frontend, backend, and Redis containers.
