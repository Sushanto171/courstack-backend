import redisClient from "../config/redis";

export const invalidateUserCache = async (email: string) => {
  await redisClient.del(`auth:user:${email}`);
};
