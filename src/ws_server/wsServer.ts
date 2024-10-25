import { WebSocketServer, Server, WebSocket } from "ws";
import { Message, Commands, CommandsKeys } from "./types";
import { Game } from "./Game";

export class wsServer {
  private port: number;
  private game: Game;
  private server: Server;

  constructor() {
    this.port = 3000;
    this.server = this.startServer();
    this.game = new Game();
  }

  private sendResponse(type: CommandsKeys, data: unknown, ws: WebSocket): void {
    const message = JSON.stringify({ type, data: JSON.stringify(data), id: 0 });
    console.log("Response: ", message);
    ws.send(message);
  }

  private handleCommands(messageData: Message, ws: WebSocket): void {
    const { type, data } = messageData;
    const preparedData = JSON.parse(data);

    switch (type) {
      case Commands.reg:
        const res = this.game.registration(preparedData);
        this.sendResponse(type, res, ws);
        this.sendResponse("update_room", this.game.rooms, ws);
        this.sendResponse("update_winners", this.game.winners, ws);
        break;
      default:
        break;
    }
  }

  private startServer(): Server {
    const server = new WebSocketServer({ port: this.port });

    server.on("connection", (ws, req) => {
      console.log(`Start websocket server on the ${this.port} port!`);

      ws.on("message", (rawData) => {
        const data = JSON.parse(rawData.toString());
        this.handleCommands(data, ws);
      });

      ws.on("close", this.stopServer.bind(this));

      ws.on("error", console.error);
    });

    return server;
  }

  private stopServer(): void {
    this.server.clients.forEach((client) => {
      client.close();

      process.nextTick(() => {
        if (
          [client.OPEN, client.CLOSING].includes(client.readyState as 1 | 2)
        ) {
          client.terminate();
        }
      });
    });
  }
}
