import { CommandDecoratorOptions } from '../types/Command';
import { DecoratorClient } from '../Client';
import { Message } from 'discord.js';
import { PluginInterface } from '../types/Plugin';
import ms from 'ms';

export function Command(opts?: CommandDecoratorOptions) {
  return function (
    target: PluginInterface,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const func: (...args: unknown[]) => void = descriptor.value;
    descriptor.value = {
      _type: 'command',
      name: opts?.name || propertyKey,
      func: async function (
        client: DecoratorClient,
        msg: Message,
        ...args: unknown[]
      ) {
        return func.apply(this, [client, msg, ...args]);
      },
      options: {},
      _cooldowns: new Map<string, number>(),
    };
    return descriptor;
  };
}

Command.alias = (...aliases: string[]) => {
  return function (
    target: PluginInterface,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (descriptor.value.options.aliases) {
      descriptor.value.options.aliases = ([] as string[]).concat(
        descriptor.value.options.aliases,
        aliases
      );
    } else {
      descriptor.value.options.aliases = aliases;
    }
    return descriptor;
  };
};

Command.cooldown = (time: string) => {
  return function (
    target: PluginInterface,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.options.cooldown = ms(time);
    return descriptor;
  };
};

Command.guildOnly = (val: boolean) => {
  return function (
    target: PluginInterface,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.options.guildOnly = val;
    return descriptor;
  };
};
