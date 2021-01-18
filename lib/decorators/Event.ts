import { ClientEvents } from 'discord.js';
import { EventDecorator } from '../types/Event';

export function Event(options?: EventDecorator) {
  return function (
    target: unknown,
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
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.options.once = true;
    return descriptor;
  };
};
