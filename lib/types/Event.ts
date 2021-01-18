import { ClientEvents } from 'discord.js';

export interface EventDecorator {
  name?: keyof ClientEvents;
}

export interface EventOptions {
  once?: boolean;
}

export interface EventInterface<K extends keyof ClientEvents> {
  name: K;
  func: (...args: ClientEvents[K]) => void;
  options: EventOptions;
}
