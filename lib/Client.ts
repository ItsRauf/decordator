import { Client, ClientOptions, Collection } from 'discord.js';

import { BlankClass } from './helpers/ClassTypeConverter';
import { PluginInterface } from './types/Plugin';
import { getCommandFromPlugin } from './helpers/getCommandFromPlugin';
import { join } from 'path';
import { parseContent } from './helpers/parseContent';
import { readdir } from 'fs/promises';

export interface DecoratorClientOptions extends ClientOptions {
  pluginPath: string;
  prefix: string;
}

export class DecoratorClient extends Client {
  plugins: Collection<string, PluginInterface>;
  pluginPath: string;
  prefix: string;

  constructor(opts: DecoratorClientOptions) {
    super(opts);
    this.plugins = new Collection();
    this.pluginPath = join(process.cwd(), opts.pluginPath);
    this.prefix = opts.prefix;
    this.on('message', msg => {
      if (msg.content.toLowerCase().startsWith(this.prefix)) {
        const [cmdName, ...args] = parseContent(this.prefix, msg.content);
        const cmd = getCommandFromPlugin(this, cmdName);
        if (cmd) {
          if (cmd.options.guildOnly && !msg.guild) return;
          if (cmd.options.cooldown) {
            if (cmd._cooldowns.has(msg.author.id)) {
              const cooldownEndTime = cmd._cooldowns.get(msg.author.id) ?? 0;
              if (Date.now() < cooldownEndTime)
                return msg.channel.send('You are in cooldown');
              else {
                cmd._cooldowns.set(
                  msg.author.id,
                  Date.now() + cmd.options.cooldown
                );
                return cmd.func(this, msg, ...args);
              }
            } else {
              cmd._cooldowns.set(
                msg.author.id,
                Date.now() + cmd.options.cooldown
              );
              return cmd.func(this, msg, ...args);
            }
          }
          return cmd.func(this, msg, ...args);
        }
      }
    });
  }

  _registerPlugin(plugin: PluginInterface): void {
    this.plugins.set(plugin.name, plugin);
    const events = Array.from(plugin.events.values());
    events.forEach(event => {
      if (typeof event.options.once !== 'undefined')
        this.once(event.name, event.func);
      else this.on(event.name, event.func);
    });
  }

  async init(): Promise<void> {
    try {
      const pluginFiles = await readdir(this.pluginPath);
      for await (const file of pluginFiles) {
        const plugin: BlankClass<PluginInterface> = (
          await import(join(this.pluginPath, file))
        ).default;
        console.log(plugin);
        new plugin()._register(this);
      }
    } catch (error) {
      console.error(new Error(error));
    }
  }
}
