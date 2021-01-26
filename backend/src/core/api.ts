import { Router, Request, Response } from "express";
import Database from "./database";
import uniqid from "uniqid";
import axios from "axios";
import qs from "querystring";
import { PlayerState } from "../models";

export default class API {
  public router: Router;
  private db: Database;

  constructor(db: Database) {
    this.db = db;
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/status", this.getStatus.bind(this));
    this.router.get("/rooms", this.getRoomList.bind(this));
    this.router.get("/rooms/:id", this.getRoom.bind(this));
    this.router.delete("/rooms/:id", this.deleteRoom.bind(this));
    this.router.post("/rooms", this.createRoom.bind(this));
    this.router.get("/videotitle/:id", this.getVideoTitle.bind(this));
  }

  private getStatus(req: Request, res: Response): void {
    res.sendStatus(200);
  }

  private async getRoomList(req: Request, res: Response): Promise<void> {
    try {
      let data;
      if (req.query.public !== undefined) {
        data = await this.db.getPublicRooms();
      } else {
        data = await this.db.getAllRooms();
      }
      res.json(data);
    } catch (err) {
      if (err.includes("404")) {
        res.sendStatus(404);
      } else {
        res.status(500).send("Error: Couldn't Retrieve list of rooms");
      }
    }
  }

  private async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.db.getRoom(req.params.id);
      res.send(data);
    } catch (err) {
      if (err.includes("404")) {
        res.sendStatus(404);
      } else {
        res.status(500).send("Error: Couldn't get room.");
      }
    }
  }

  private async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      await this.db.deleteRoom(req.params.id);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send("Error: Couldn't delete room.");
    }
  }

  private async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const ids = await this.db.getRoomIds();
      let roomId = uniqid();
      while (ids.includes(roomId)) {
        roomId = uniqid();
      }
      const resp = await axios.get(`https://youtube.com/get_video_info?video_id=${req.body.videoId}`);
      const videoInfo = qs.parse(resp.data);
      const playerResponse = JSON.parse(videoInfo["player_response"] as string);
      await this.db.setRoom(
        roomId,
        Object.assign(
          {
            currVideoTitle: playerResponse.videoDetails.title,
            default: false,
            videoQueue: [],
            playerState: PlayerState.UNSTARTED
          },
          req.body
        )
      );
      res.send(roomId);
    } catch (err) {
      res.status(500).send("Error: Couldn't create room.");
    }
  }

  private async getVideoTitle(req: Request, res: Response): Promise<void> {
    try {
      const url = `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${req.params.id}&format=json`;
      const resp = await axios.get(url);
      res.send(resp.data.title);
    } catch (err) {
      console.error(err);
      res.status(404).send(`Error: Youtube video not found with id ${req.params.id}.`);
    }
  }
}
