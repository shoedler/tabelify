export const distinct = <T>(arr: T[]): T[] => [...new Set(arr)];

export const allKeysOf = <T>(obj: T[]) =>
  obj.map((item) => (item ? Object.keys(item) : [])).reduce((a, b) => a.concat(b), []);

export const isPrimitive = (value: any) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value == 'object' || typeof value == 'function') {
    return false;
  }

  return true;
};
