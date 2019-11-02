import redis from 'redis';

interface Room{
    owner: string,
    capacity: number
}

export class DBS{
    port: number;
    host: string;
    client: redis.RedisClient;
    constructor(){
        this.port = 6379;
        this.host = "localhost";
        this.client = redis.createClient(this.port, this.host);

        this.client.on('connect', () => {
            console.log(`connected to redis`);
        });
        this.client.on('error', err => {
            console.log(`Error: ${err}`);
        });
    }

    testConnect(){
        this.client.set('my test key', "Success!", redis.print);
        this.client.get('my test key', function (err, res) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('GET result ->' + res);
        });
    }

    createRoom(roomid:string, roominfo:Room){
        console.log("Room info", roominfo);
        try{
            this.client.set(roomid, JSON.stringify(roominfo), redis.print);
        }
        catch(err){
            throw err;
        }
    }

    deleteRoom(roomid:string){
        try{
            this.client.del(roomid);
        }
        catch(err){
            return err;
        }
    }

    getRoom(roomid:string){
        return new Promise((resolve, reject) => {
            console.log("Querying " + roomid);
            this.client.get(roomid, function (err, res) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log('GET result ->' + res);
                resolve(res);
            });
        });
    }

    getAllRooms(){
        this.client.keys('*', function (err, keys) {
            if(err){
                console.log(err);
                throw err;
            }
            return keys;
        });        
    }
}
