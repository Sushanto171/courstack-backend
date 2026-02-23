import { createClient, RedisClientType } from "redis";
import config from ".";

let redisClient: RedisClientType | null = null;

export const getRedis = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    redisClient = createClient({
      username: "default",
      password: config.redis.REDIS_PASS,
      socket: {
        host: config.redis.REDIS_HOST,
        port: Number(config.redis.REDIS_PORT),
      },
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }

  // connect only if not already connected
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("📤 Redis connection established!");
  }

  return redisClient;
};