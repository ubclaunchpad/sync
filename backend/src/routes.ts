import { Router } from "express";
import {DBS} from './db';

const router = Router();
const redisDB = new DBS();

redisDB.testConnect();

router.get('/', (req, res) => {
  res.send('Hello world');
})

export default router;
