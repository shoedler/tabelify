export const distinct = <T>(arr: T[]): T[] => [...new Set(arr)];

export const isPrimitive = (value: any) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value == 'object' || typeof value == 'function') {
    return false;
  }

  return true;
};

export const allKeysOf = <T>(obj: T[]) =>
  obj
    .filter((item) => !isPrimitive(item) && !Array.isArray(item))
    .map((item) => (item ? Object.keys(item) : []))
    .reduce((a, b) => a.concat(b), []);

export const getUmlautCount = (str: string) => {
  return str.match(/\u{308}/gmu)?.length ?? 0; // Currently, only U+0308 is supported. (7̈ )
};
