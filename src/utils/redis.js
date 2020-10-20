const redis = require("redis");
const { promisify } = require("util");

const Redis = {
  connect: function () {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        this.client = redis.createClient({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        });
        this.client.get = promisify(this.client.get);
      }
      return resolve(this.client);
    });
  },
  setData: function (key, data, expiry) {
    return this.connect().then(client => {
      if (expiry) {
        client.set(key, data, "EX", expiry);
      } else {
        client.set(key, data);
      }
    });
  },
  getData: function (key) {
    return this.connect().then(client => client.get(key));
  },  
};

module.exports = Redis;
