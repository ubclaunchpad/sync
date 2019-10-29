import { Router } from "express";
import {DBS} from './db';

const router = Router();
const redisDB = new DBS();

redisDB.testConnect();

router.get('/', (req, res) => {
  res.send('Hello world');
})

router.get('/rooms/:roomid', (req, res) => {
  redisDB.getRoom(req.params.roomid);
})

router.post('/rooms', (req, res) => {
  redisDB.createRoom(req.params.roomid, req.params.roominfo);
})

export default router;
