import redis from 'redis';

export class DBS{
    port: number;
    host: string;
    client: redis.RedisClient;
    constructor(){
        this.port = 6379;
        // this.host = "127.0.0.1";
        this.host = "redis";
        this.client = redis.createClient(this.port, this.host);

        this.client.on('connect', () => {
            console.log(`connected to redis`);
        });
        this.client.on('error', err => {
            console.log(`Error: ${err}`);
        });
    }

    // Set up Queries here
    testConnect(){
        // Example
        this.client.set('my test key', "Success!", redis.print);
        this.client.get('my test key', function (err, res) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('GET result ->' + res);
        });
    }

    // Create Room
    createRoom(roomid:any, roominfo:any){
        try{
            this.client.set(roomid, roominfo, redis.print);
        }
        catch(err){
            throw err;
        }
    }

    // Delete Room
    deleteRoom(roomid:any){
        try{
            this.client.del(roomid);
        }
        catch(err){
            return err;
        }
    }

     // get Room
    getRoom(roomid:any){
        this.client.get(roomid, function (err, res) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('GET result ->' + res);
            return res;
        });
    }

    // get Room
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
