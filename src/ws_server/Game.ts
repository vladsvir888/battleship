import { Player, ReturnRegistrationData, Room, Winner } from "./types";
import { generateId } from "./utils";

export class Game {
  private _players: Player[];
  private _rooms: Room[];
  private _winners: Winner[];

  constructor() {
    this._players = [];
    this._rooms = [];
    this._winners = [];
  }

  public registration(rawData: string, index: number): ReturnRegistrationData {
    const data = JSON.parse(rawData) as Player;
    const player = this._players.find((player) => player.name === data.name);

    if (!player) {
      this._players.push({ name: data.name, index });

      return {
        name: data.name,
        index,
        error: false,
        errorText: "",
      };
    }

    return {
      name: data.name,
      index: -1,
      error: true,
      errorText: `Player ${data.name} is already exists.`,
    };
  }

  public createRoom(index: number): void {
    const player = this._players.find((player) => player.index === index);
    const isRoomHasThisPlayer = this._rooms.some((room) =>
      room.roomUsers.some((user) => user.index === index)
    );
    const isRoomHasPlayers = this._rooms.length;

    if (player && !isRoomHasPlayers && !isRoomHasThisPlayer) {
      this._rooms.push({
        roomId: generateId(),
        roomUsers: [player],
      });
    }
  }

  public get rooms(): Room[] {
    return this._rooms;
  }

  public get winners(): Winner[] {
    return this._winners;
  }
}
