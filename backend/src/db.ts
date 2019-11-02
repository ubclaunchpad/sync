import redis from 'redis';

interface Room{
    roomid: string,
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
    createRoom(roomid:string, roominfo:any){
        try{
            this.client.set(roomid, roominfo, redis.print);
        }
        catch(err){
            throw err;
        }
    }

    // Delete Room
    deleteRoom(roomid:string){
        try{
            this.client.del(roomid);
        }
        catch(err){
            return err;
        }
    }

     // get Room
    getRoom(roomid:string){
        this.client.get(roomid, function (err, res) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('GET result ->' + res);
            return res;
        });
    }

    // get All Rooms
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
