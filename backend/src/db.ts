import redis from 'redis';

export class DBS{
    port: number;
    host: string;
    client: redis.RedisClient;
    constructor(){
        this.port = 6379;
        this.host = "127.0.0.1";
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
}
