class DBS{
    constructor(){
        this.port = 6379;
        this.host = "127.0.0.1";
        this.redis = require('redis');
        this.client = this.redis.createClient(this.port, this.host);

        this.client.on('connect', () => {
            console.log(`connected to redis`);
        });
        this.client.on('error', err => {
            console.log(`Error: ${err}`);
        });
    }

    // Set up Queries here
    testOutput(){
        // Example
        this.client.set('my test key', {foo: "bar"}, this.redis.print);
        this.client.get('my test key', function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log('GET result ->' + result);
        });
    }
}


module.exports = DBS;
