import { BlankClass, ClassTypeConverter } from '../helpers/ClassTypeConverter';

import { ClientEvents } from 'discord.js';
import { CommandInterface } from '../types/Command';
import { DecoratorClient } from '../Client';
import { EventInterface } from '../types/Event';
import { PluginInterface } from '../types/Plugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getBasePluginMethods<T extends BlankClass<any>>(basePlugin: T) {
  const commandStore = new Map<string, CommandInterface>();
  const eventStore = new Map<string, EventInterface<keyof ClientEvents>>();
  const plugin = new basePlugin();
  const methods = Object.getOwnPropertyNames(
    Object.getPrototypeOf(plugin)
  ).filter(m => m !== 'constructor');
  for (const method of methods) {
    if (plugin[method]._type === 'command') {
      commandStore.set(plugin[method].name, plugin[method]);
      if (
        plugin[method].options.aliases &&
        plugin[method].options.aliases.length > 0
      )
        plugin[method].options.aliases.forEach((alias: string) =>
          commandStore.set(alias, plugin[method])
        );
    } else if (plugin[method]._type === 'event')
      eventStore.set(plugin[method].name, plugin[method]);
  }
  return {
    events: Array.from(eventStore.entries()),
    commands: Array.from(commandStore.entries()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Plugin<T extends BlankClass<any>>(plugin: T): T {
  const { commands, events } = getBasePluginMethods(plugin);
  plugin.prototype.commands = new Map<string, CommandInterface>(commands);
  plugin.prototype.events = new Map<string, EventInterface<keyof ClientEvents>>(
    events
  );
  plugin.prototype._register = function (client: DecoratorClient) {
    client._registerPlugin(
      ClassTypeConverter<T, PluginInterface>(new plugin())
    );
  };
  return plugin;
}

Plugin.guildOnly = (val: boolean) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T extends BlankClass<any>>(plugin: T) {
    const commands: [string, CommandInterface][] = Array.from(
      plugin.prototype.commands.entries()
    );
    const updated: [string, CommandInterface][] = commands.map(
      ([name, cmd]) => {
        if (typeof cmd.options.guildOnly === 'undefined')
          cmd.options.guildOnly = val;
        return [name, cmd];
      }
    );
    plugin.prototype.commands = new Map<string, CommandInterface>(updated);
  };
};
