import {
  Player,
  RegistrationData,
  Room,
  Winner,
  AddUserToRoomData,
  CreateGameData,
} from "./types";
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

  public registration(rawData: string, index: number): RegistrationData {
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
    const isRoomHasPlayer = this._rooms.some((room) =>
      room.roomUsers.some((user) => user.index === index)
    );
    const isRoomHasPlayers = this._rooms.length > 0;

    if (player && !isRoomHasPlayers && !isRoomHasPlayer) {
      this._rooms.push({
        roomId: generateId(),
        roomUsers: [player],
      });
    }
  }

  private cleanRoom(): void {
    this._rooms = [];
  }

  public addUserToRoom(
    rawData: string,
    index: number
  ): CreateGameData | undefined {
    const data = JSON.parse(rawData) as AddUserToRoomData;
    const room = this._rooms.find((room) => room.roomId === data.indexRoom);
    const roomPlayer = room?.roomUsers.find(
      (roomUser) => roomUser.index === index
    );
    if (roomPlayer) {
      return;
    }

    const playerOutsideRoom = this._players.find(
      (player) => player.index === index
    );
    if (playerOutsideRoom) {
      room?.roomUsers.push(playerOutsideRoom);
    }

    if (room?.roomUsers.length === 2) {
      this.cleanRoom();
      return this.createGame();
    }
  }

  private createGame(): CreateGameData {
    const idGame = generateId();
    const players = this._players.map((player) => ({
      idPlayer: player.index,
    }));

    return {
      idGame,
      players,
    };
  }

  public get players(): Player[] {
    return this._players;
  }

  public get rooms(): Room[] {
    return this._rooms;
  }

  public get winners(): Winner[] {
    return this._winners;
  }
}
