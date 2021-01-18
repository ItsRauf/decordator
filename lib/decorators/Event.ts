import { ClientEvents } from 'discord.js';
import { EventDecorator } from '../types/Event';
import { PluginInterface } from '../types/Plugin';

export function Event(options?: EventDecorator) {
  return function (
    target: PluginInterface,
    propertyKey: keyof ClientEvents,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const func = descriptor.value;
    descriptor.value = {
      _type: 'event',
      name: options?.name || propertyKey,
      func,
      options: {},
    };
    return descriptor;
  };
}

Event.once = () => {
  return function (
    target: PluginInterface,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.options.once = true;
    return descriptor;
  };
};
