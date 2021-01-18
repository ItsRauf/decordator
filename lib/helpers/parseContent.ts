export function parseContent(
  prefix: string,
  content: string
): [string, ...string[]] {
  const split = content.split(' ');
  const cmdName = split[0].slice(prefix.length).toLowerCase();
  split.shift();
  return [cmdName, ...split];
}
