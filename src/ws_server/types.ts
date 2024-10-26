type NumberOrString = number | string;

export enum Commands {
  reg = "reg",
  update_winners = "update_winners",
  create_room = "create_room",
  add_user_to_room = "add_user_to_room",
  create_game = "create_game",
  update_room = "update_room",
  add_ships = "add_ships",
  start_game = "start_game",
  attack = "attack",
  randomAttack = "randomAttack",
  turn = "turn",
  finish = "finish",
}

export type CommandsKeys = keyof typeof Commands;

export type Message = {
  type: CommandsKeys;
  data: string;
  id: 0;
};

export type ReturnRegistrationData = {
  name: string;
  index: NumberOrString;
  error: boolean;
  errorText: string;
};

export type Player = {
  name: string;
  index: NumberOrString;
};

export type Room = {
  roomId: NumberOrString;
  roomUsers: Player[];
};

export type Winner = {
  name: string;
  wins: number;
};
