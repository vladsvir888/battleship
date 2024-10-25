import { generateId } from "./utils";
import {
  RegistrationData,
  ReturnRegistrationData,
  Room,
  Winner,
} from "./types";

export class Game {
  private _players: RegistrationData[];
  private _rooms: Room[];
  private _winners: Winner[];

  constructor() {
    this._players = [];
    this._rooms = [];
    this._winners = [];
  }

  public registration(data: RegistrationData): ReturnRegistrationData {
    const player = this._players.find((player) => player.name === data.name);

    if (!player) {
      this._players.push(data);

      return {
        name: data.name,
        index: generateId(),
        error: false,
        errorText: "",
      };
    }

    return {
      name: data.name,
      index: generateId(),
      error: true,
      errorText: `User ${data.name} is already exists.`,
    };
  }

  public get rooms() {
    return this._rooms;
  }

  public get winners() {
    return this._winners;
  }
}
