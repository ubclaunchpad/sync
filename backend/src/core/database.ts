import redis from "redis";
import logger from "../config/logger";
import { RoomInfo, RoomList } from "../models";

export default class Database {
  private client: redis.RedisClient;

  constructor(uri?: string) {
    if (uri) {
      this.client = redis.createClient(uri);
    } else {
      this.client = redis.createClient();
    }

    this.initListeners();
  }

  public async setRoom(id: string, room: RoomInfo): Promise<void> {
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

  public async getRoom(id: string): Promise<RoomInfo> {
    return new Promise<RoomInfo>((resolve, reject) => {
      logger.info(`Get room ${id}`);
      this.client.get(`room:${id}`, (err, res) => {
        if (err) {
          logger.error(`Couldn't get room: ${err}`);
          reject(err);
        }
        if (!res) {
          logger.error(`Room ${id} not found`);
          reject(`404: Room ${id} not found`);
        } else {
          resolve(JSON.parse(res));
        }
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

  public async getAllRooms(): Promise<RoomList> {
    return new Promise<RoomList>((resolve, reject) => {
      logger.info("Get room list");
      const rooms: RoomList = {};
      this.client.keys("*", async (err, keys) => {
        for (const key of keys) {
          const id = key.split(":")[1];
          rooms[id] = await this.getRoom(key.split(":")[1]);
        }
        resolve(rooms);
      });
    });
  }

  public async getPublicRooms(): Promise<RoomList> {
    return new Promise<RoomList>((resolve, reject) => {
      logger.info("Get room list");
      const rooms: RoomList = {};
      this.client.keys("*", async (err, keys) => {
        for (const key of keys) {
          const id = key.split(":")[1];
          const room = await this.getRoom(id);
          if (!room.private) {
            rooms[id] = room;
          }
        }
        resolve(rooms);
      });
    });
  }

  private initListeners(): void {
    this.client.on("connect", () => {
      logger.info("Connected to Redis Server");
    });

    this.client.on("error", (err) => {
      logger.error(`Redis Server Error: ${err}`);
    });
  }
}
