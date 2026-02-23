import { getRedis } from "../config/redis";

export const invalidateUserCache = async (email: string) => {
  const redisClient = await getRedis()
  await redisClient.del(`auth:user:${email}`);
};
