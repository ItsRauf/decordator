import { ClientEvents } from 'discord.js';
import { CommandInterface } from './Command';
import { DecoratorClient } from '../Client';
import { EventInterface } from './Event';

export interface PluginInterface {
  new (...args: unknown[]): this;
  commands: Map<string, CommandInterface>;
  events: Map<string, EventInterface<keyof ClientEvents>>;
  _register: (client: DecoratorClient) => void;
}
