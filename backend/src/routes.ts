import { Router } from "express";
import {DBS} from './db';
import bodyParser from 'body-parser';

const uuidv1 = require('uuid/v1');
const router = Router();
const redisDB = new DBS();

redisDB.testConnect();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get('/', (req, res) => {
  res.send('Hello world');
})

router.get('/rooms', (req, res) => {
  console.log(req.query["roomid"]);
  const id = req.query["roomid"]
  redisDB.getRoom(id).then((data) => {
    res.send(data);
  }, (err) => {
    res.status(400).send("Error, room doesn't exist. " + err);
  });
})

router.post('/rooms', (req, res) => {
  redisDB.getAllRooms().then((data: any) => {
    let roomid = uuidv1();
    const existingKeys = new Set(data);
    while(existingKeys.has(roomid)){
      roomid = uuidv1();
    }
    redisDB.createRoom(roomid, req.body);
    res.send(roomid);
  }, (err) => {
    res.send(err);
  })
})

export default router;
