import * as dotenv from "dotenv";
dotenv.config();

import path from "path";
import express, { Express, Request, Response } from "express";
import { WebSocketServer } from "ws";

import logger from "./utils/logger";
import monitorAirbox from "./utils/monitor";
import wss from "./utils/websocket";
import { formData, verifyInput } from "./middleware/formDataValidation";

const app: Express = express();
const PORT = process.env.PORT || 5533;
const staticPath = path.join(__dirname, "public");

app.use(express.json());
app.use(express.static(staticPath));

let id: NodeJS.Timer;

app.post(
  "/api/v1/monitor",
  verifyInput(formData),
  (req: Request, res: Response) => {
    let timerId;
    clearInterval(timerId);
    timerId = monitorAirbox({ ...req.body, frequency: 1000 });
    res.status(200).json({ message: "OK" });
  }
);

app.get("/api/v1/monitor", (req: Request, res: Response) => {
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        text: "hi",
      })
    );
  });
  res.json({
    data: {},
  });
});

const start = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server is listening on: 127.0.0.1:${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    logger.error(error);
    process.exit(1);
  }
};

process.on("uncaughtException", () => {
  logger.error("Uncaught error on NODE");
  process.exit(1);
});
process.on("unhandledRejection", () => {
  logger.error("Unhandledt rejection on NODE");
  process.exit(1);
});

start();
