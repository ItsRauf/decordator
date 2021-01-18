import { DecoratorClient } from '../Client';
import { Message } from 'discord.js';

export type CommandFunction = (
  client: DecoratorClient,
  msg: Message,
  ...args: string[]
) => void;

export interface CommandDecoratorOptions {
  name?: string;
  shortDescription?: string;
  description?: string;
}

export interface CommandOptions {
  guildOnly?: boolean;
  cooldown?: number;
}

export interface CommandInterface {
  name: string;
  func: CommandFunction;
  options: CommandOptions;
  _cooldowns: Map<string, number>;
}
