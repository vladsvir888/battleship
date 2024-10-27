import { WebSocketServer, Server, WebSocket } from "ws";
import { Message, Commands, CommandsKeys } from "./types";
import { Game } from "./Game";
import { generateId } from "./utils";

export class wsServer {
  private port: number;
  private game: Game;
  private server: Server;
  private wsStorage: { [key: string]: WebSocket };

  constructor() {
    this.port = 3000;
    this.wsStorage = {};
    this.server = this.startServer();
    this.game = new Game();
  }

  private sendResponse(type: CommandsKeys, data: unknown, ws: WebSocket): void {
    const message = JSON.stringify({ type, data: JSON.stringify(data), id: 0 });
    console.log("Response: ", message);
    ws.send(message);
  }

  private handleCommands(
    messageData: Message,
    ws: WebSocket,
    index: number
  ): void {
    const { type, data } = messageData;

    switch (type) {
      case Commands.reg: {
        const res = this.game.registration(data, index);

        this.sendResponse(type, res, ws);
        this.server.clients.forEach((client) => {
          this.sendResponse("update_room", this.game.rooms, client);
          this.sendResponse("update_winners", this.game.winners, client);
        });
        break;
      }
      case Commands.create_room: {
        this.game.createRoom(index);
        this.server.clients.forEach((client) => {
          this.sendResponse("update_room", this.game.rooms, client);
        });
        break;
      }
      case Commands.add_user_to_room: {
        const res = this.game.addUserToRoom(data, index);

        if (!res) {
          this.server.clients.forEach((client) => {
            this.sendResponse("update_room", this.game.rooms, client);
          });
          return;
        }

        const { idGame, players } = res;

        for (const key in this.wsStorage) {
          const ws = this.wsStorage[key];
          const player = players.find((player) => player.idPlayer === +key);

          this.sendResponse("update_room", this.game.rooms, ws);
          this.sendResponse(
            "create_game",
            { idGame, idPlayer: player?.idPlayer },
            ws
          );
        }

        break;
      }
      case Commands.add_ships: {
        break;
      }
      default:
        break;
    }
  }

  private startServer(): Server {
    const server = new WebSocketServer({ port: this.port });

    server.on("connection", (ws) => {
      console.log(`Start websocket server on the ${this.port} port!`);

      const index = generateId();
      this.wsStorage[index] = ws;

      ws.on("message", (rawData) => {
        const data = JSON.parse(rawData.toString());
        console.log(`Command: ${data.type}`);
        this.handleCommands(data, ws, index);
      });

      ws.on("close", () => {
        delete this.wsStorage[index];
        ws.close();
      });

      ws.on("error", console.error);
    });

    return server;
  }
}
