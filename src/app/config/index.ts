import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV as "development" | "production",
  port: process.env.PORT,
  superAdmin: {
    email: process.env.SEED_SUPER_ADMIN_EMAIL,
    password: process.env.SEED_SUPER_ADMIN_PASSWORD,
    name: process.env.SEED_SUPER_ADMIN_NAME ?? 'Super Admin',
  },
  jwt: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "YOUR_ACCESS_SECRET",
    JWT_ACCESS_EXPIRE_IN: process.env.JWT_ACCESS_EXPIRE_IN || "1d",

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "YOUR_REFRESH_SECRET",
    JWT_REFRESH_EXPIRE_IN: process.env.JWT_REFRESH_EXPIRE_IN || "7d",
  },
  redis: {
    REDIS_PASS: process.env.REDIS_PASS,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
  },
  cloudinary: {
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
  }
}