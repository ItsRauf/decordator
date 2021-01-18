import { Client, ClientOptions, Collection } from 'discord.js';

import { PluginInterface } from './types/Plugin';
import { join } from 'path';

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
  }
}
