import { Router, Request, Response } from "express";
import Database from "./database";
import uniqid from "uniqid";

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
    this.router.get("/rooms/:id", this.getRoom.bind(this));
    this.router.delete("rooms/:id", this.deleteRoom.bind(this))
    this.router.post("/rooms", this.createRoom.bind(this));
  }

  private getStatus(req: Request, res: Response): void {
    res.status(200).send();
  }

  private async getRoom(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.db.getRoom(req.params.id);
      res.send(data);
    } catch (err) {
      res.status(400).send("Error: Couldn't get room.");
    }
  }

  private async deleteRoom(req: Request, res: Response): Promise<void>  {
    try {
      await this.db.deleteRoom(req.params.id);
      res.send(200).send();
    } catch (err) {
      res.status(400).send("Error: Couldn't delete room.");
    }
  }

  private async createRoom(req: Request, res: Response): Promise<void>  {
    try {
      const ids = await this.db.getRoomIds();
      let roomId = uniqid();
      while (ids.includes(roomId)) {
        roomId = uniqid();
      }
      const data = await this.db.createRoom(roomId, req.body);
      res.send(200).send();
    } catch (err) {
      res.status(400).send("Error: Couldn't create room.");
    }
  }
}
