import { getRedis } from "../config/redis";

export const setCache = async (cacheKey: string, value: object | string | number, expiration: number) => {
  const redisClient = await getRedis()
  return await redisClient.set(cacheKey,
    JSON.stringify(value),
    {
      expiration:
      {
        type: "EX",
        value: expiration * 60
      }
    });
}


export const getCache = async (cacheKey: string) => {
  const redisClient = await getRedis()
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);
  return null
}

export const clearCache = async (cacheKey: string) => {
  const redisClient = await getRedis()
  await redisClient.del(cacheKey)
};
