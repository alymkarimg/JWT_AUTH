// src/index.js
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { userRoutes } from './routes/userRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use('/user', userRoutes)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});