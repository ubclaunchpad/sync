// const express = require('express');
// const socketio = require('socket.io');
// const http = require('http');

// const PORT = process.env.PORT || 5000;


// const router = express.Router();

// router.get('/',(req,res) => {
//     res.send('server is running!')
// });


// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// io.on('connection', (socket) => {
//     console.log("new connection!");

//     socket.on('join',({name, room}, callback) => {
//         console.log("Printing here");
//         callback()
//     });

//     socket.on('disconnect', () => {
//         console.log("User left.");
//     });
// });

// app.use(router);

// server.listen(PORT, () => console.log(`Server has started on port ${PORT}`)
// )
  
export default "Hi";