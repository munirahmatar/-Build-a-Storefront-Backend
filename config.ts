import dotenv from "dotenv";

dotenv.config();

const {
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_DATABASE_TEST,
  DB_USER,
  DB_PASS,
  PORT,
  BCRYPT_PASSWORD,
  SALT_ROUNDS,
  TOKEN_SECRET
} = process.env;

export default {
  port: PORT,
  host: DB_HOST,
  dbPort: DB_PORT,
  database: NODE_ENV === "development" ? DB_DATABASE : DB_DATABASE_TEST,
  user: DB_USER,
  password: DB_PASS,
  pepper: BCRYPT_PASSWORD,
  salt: SALT_ROUNDS,
  tokenSecret: TOKEN_SECRET
};