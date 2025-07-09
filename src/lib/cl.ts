export function cl(...things: (string | Record<string, boolean>)[]): string {
  const result: string[] = [];

  for (const thing of things) {
    if (typeof thing === "string") {
      result.push(thing);
    } else {
      for (const key in thing) {
        if (thing[key] === true) {
          result.push(key);
        }
      }
    }
  }

  return result.join(" ");
}
