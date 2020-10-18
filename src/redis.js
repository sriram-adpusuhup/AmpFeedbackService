const redis = require("redis");
const { promisify } = require("util");

const Redis = {
  connect: function () {
    if (!this.client) {
      this.client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      });
      this.client.get = promisify(this.client.get);
    }
  },
  setData: function (key, data, expiry) {
    if (expiry) {
      this.client.set(key, data, "EX", expiry);
    } else {
      this.client.set(key, data);
    }
  },
  getData: function (key) {
    return this.client.get(key);
  },  
};

module.exports = Redis;
