import { WebSocketServer } from "ws";
import logger from "./logger";

import type { WsData } from "../types";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("error", logger.error);

  ws.on("message", function message(data) {
    logger.info("received: %s", data);
  });
});

export const sendWsData = (data: Partial<WsData>) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
};

export default wss;
