import dotenv from 'dotenv';
import { Dialect, Sequelize } from 'sequelize';

dotenv.config()


// Option 3: Passing parameters separately (other dialects)
export const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DRIVER as Dialect
});