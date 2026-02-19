import { createClient } from 'redis';
import config from '.';

const redisClient = createClient({
  username: 'default',
  password: config.redis.REDIS_PASS,
  socket: {
    host: config.redis.REDIS_HOST,
    port: Number(config.redis.REDIS_PORT)
  }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export default redisClient