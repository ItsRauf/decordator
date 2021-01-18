import { CommandInterface } from '../types/Command';
import { DecoratorClient } from '../Client';

export function getCommandFromPlugin(
  client: DecoratorClient,
  cmdName: string
): CommandInterface | undefined {
  const plugins = Array.from(client.plugins.values());
  const commandMaps = plugins.map(plugin => plugin.commands);
  const commandMap = commandMaps.find(map => map.has(cmdName));
  return commandMap?.get(cmdName);
}
