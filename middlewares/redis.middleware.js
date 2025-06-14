const redisClient = require("../redis/redis.client");

const cacheProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const d = new Date();
    const cachedData = await redisClient.get(`product:${id}`);
    if (cachedData) {
      console.log("from redis")
      console.log(new Date() - d)
      return res.json(JSON.parse(cachedData));
    }
    next(); 
  } catch (err) {
    console.error("Redis error:", err);
    next();
  }
};

module.exports = cacheProduct;
