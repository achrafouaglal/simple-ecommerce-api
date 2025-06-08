const redis = require("redis");
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") }); 

const client = redis.createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});

client.connect()
  .then(() => console.log("✅ Connected to Redis Cloud"))
  .catch(console.error);

module.exports = client;
