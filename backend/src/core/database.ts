import redis from "redis";
import logger from "../config/logger";
import Room from "../models/room";

export default class Database {
  private client: redis.RedisClient;

  constructor(port: number, host?: string) {
    if (host) {
      this.client = redis.createClient(port, host);
    } else {
      this.client = redis.createClient(port);
    }

    this.initListeners();
  }

  public async setRoom(id: string, room: Room): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      logger.info(`Set room ${id}`);
      this.client.set(`room:${id}`, JSON.stringify(room), (err, res) => {
        if (err) {
          logger.error(`Couldn't set room: ${err}`);
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
        if (!res) {
          logger.error(`Room ${id} not found`);
          reject(`404: Room ${id} not found`);
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
      this.client.keys("room:*", function(err, res) {
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

  public async getAllRooms(): Promise<Room[]> {
    console.log("Run this ls;akdjfa;lksdf;alksdf");
    return new Promise<Room[]>((resolve, reject) => {
      logger.info("Get room list");
      const rooms: Room[] = [];
      try {
        this.client.keys("*", async (err, keys) => {
          for (const key of keys) {
            rooms.push(await this.getRoom(key));
          }
        });
        resolve(rooms);
      } catch (err) {
        logger.error(`Couldn't retrieve the list of rooms. ${err}`);
        resolve(err);
      }
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
