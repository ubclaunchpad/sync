import redis from "redis";
import logger from "../logger";

interface Room {
  name: string,
  url: string
}

export default class Database {
  private client: redis.RedisClient;

  constructor(port?: number, host?: string) {
    if (port && host) {
      this.client = redis.createClient(port, host);
    } else {
      this.client = redis.createClient();
    }

    this.initListeners();
  }

  public async createRoom(id: string, room: Room): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      logger.info(`Create room ${id}`);
      this.client.set(`room:${id}`, JSON.stringify(room), (err, res) => {
        if (err) {
          logger.error(`Couldn't create room: ${err}`);
          reject(err);
        }
        resolve();
      });
    });
  }

  public async getRoom(id: string): Promise<Room> {
    return new Promise<Room>((resolve, reject) => {
      logger.info(`Get room ${id}`);
      this.client.get(`room:${id}`, (err, res) => {
        if (err) {
          logger.error(`Couldn't get room: ${err}`);
          reject(err);
        }
        resolve(JSON.parse(res));
      });
    });
  }

  public async deleteRoom(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      logger.info(`Delete room ${id}`);
      this.client.del(`room:${id}`, (err, res) => {
        if (err) {
          logger.error(`Couldn't delete room: ${err}`);
          reject(err);
        }
        resolve();
      });
    });
  }

  public async getRoomIds(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      logger.info(`Get room ids`);
      this.client.keys("room:*", function (err, res) {
        if (err) {
          logger.error(`Couldn't get room ids: ${err}`);
          reject(err);
        }

        const ids = [];
        for (const key of res) {
          ids.push(key.replace("room:", ""));
        }
        resolve(ids);
      });
    });
  }

  private initListeners(): void {
    this.client.on("connect", () => {
      logger.info("Connected to Redis Server");
    });

    this.client.on("error", err => {
      logger.error(`Redis Server Error: ${err}`);
    });
  }

}
