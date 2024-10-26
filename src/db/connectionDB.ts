import { Pool, PoolConfig } from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

const databaseURL = process.env.DATABASE_URL
let config: PoolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}
if (databaseURL) {
  const params = new URL(databaseURL)
  config = {
    host: params.hostname,
    user: params.username,
    port: Number(params.port),
    password: params.password,
    database: params.pathname.split('/')[1]
  }
}
const dbClient = new Pool(config)

export default dbClient

export const ALREADY_EXIST_CODE = '23505'
