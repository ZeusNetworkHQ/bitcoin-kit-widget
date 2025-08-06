import _ from "lodash";

export function camelize<T>(obj: unknown): T {
  if (Array.isArray(obj)) return obj.map(camelize) as T;

  if (_.isPlainObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj as object).map(([key, value]) => [
        _.camelCase(key),
        camelize(value),
      ]),
    ) as T;
  }
  return obj as T;
}

export function snakify<T>(obj: unknown): T {
  if (Array.isArray(obj)) return obj.map(snakify) as T;

  if (_.isPlainObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj as object).map(([key, value]) => [
        _.snakeCase(key),
        snakify(value),
      ]),
    ) as T;
  }
  return obj as T;
}

export function createCacheCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
) {
  const cache = new Map<string, Promise<ReturnType<T>>>();

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = Promise.resolve(fn(...args)) as Promise<ReturnType<T>>;
    cache.set(key, result);
    return await result;
  };
}
