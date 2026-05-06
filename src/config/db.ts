import { env } from "elysia";
import pg, { Pool } from "pg";

const poolConfig = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  database: env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

export const pool = new Pool(poolConfig);

export const checkDbConnection = async () => {
  try {
    await pool.query(`SELECT 1`);
    console.log("Db connected successfully");
  } catch (error) {
    console.error("Db connection failed");
    process.exit(1);
  }
};
