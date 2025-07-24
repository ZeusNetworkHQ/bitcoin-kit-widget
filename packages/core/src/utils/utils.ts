import _ from "lodash";

export function camelize<T>(obj: unknown): T {
  if (Array.isArray(obj)) return obj.map(camelize) as T;

  if (_.isPlainObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj as object).map(([key, value]) => [
        _.camelCase(key),
        camelize(value),
      ])
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
      ])
    ) as T;
  }
  return obj as T;
}
