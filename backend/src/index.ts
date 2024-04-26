import { WebSocketServer, WebSocket } from "ws";
import { GameManager } from "./GameManager";
import url from "url";

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

wss.on("connection", function connection(ws: WebSocket, req) {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
});

console.log("done");
