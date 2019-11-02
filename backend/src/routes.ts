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
  var id = req.query["roomid"]
  redisDB.getRoom(id).then((data) => {
    res.send(data);
  }, (err) => {
    res.status(400).send("Error, room doesn't exist. " + err);
  });
})

router.post('/rooms', (req, res) => {
  var roomid = uuidv1();
  // console.log(req);
  console.log(req.body);
  redisDB.createRoom(roomid, req.body);
  res.send("Created room id " + roomid);
})

export default router;
