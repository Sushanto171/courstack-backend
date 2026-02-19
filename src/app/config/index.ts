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
  }
}