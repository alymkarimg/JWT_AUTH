// src/index.js
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { sequelize } from "./config/db";
import dbInit from "./db/init";
import { userRoutes } from './routes/userRoutes';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json())

app.use('/user', userRoutes)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    dbInit()
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
