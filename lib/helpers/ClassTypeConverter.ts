interface IndexSignitureObject {
  [key: string]: unknown;
}
export type BlankClass<T> = { new (...args: unknown[]): T };

export function ClassTypeConverter<
  O extends BlankClass<IndexSignitureObject>,
  N
>(orig: O): N {
  return (orig as unknown) as N;
}
