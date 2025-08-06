export default class Cache<T extends Record<string, unknown>> {
  private store: Partial<T>;
  private readonly key: string;

  constructor(key: string, initialData: Partial<T> = {}) {
    this.key = key;
    this.store = { ...initialData, ...this.readStorage() };
  }

  public get<TKey extends keyof T, TDefault extends T[TKey] | undefined>(
    key: TKey,
    defaultValue: TDefault = undefined as TDefault,
  ): T[TKey] | TDefault {
    this.store = this.readStorage();
    const value = this.store[key] ?? defaultValue;

    return value;
  }

  public keys(): (keyof T)[] {
    return Object.keys(this.store);
  }

  public entries(): [keyof T, T[keyof T]][] {
    return Object.entries(this.store);
  }

  public set<TKey extends keyof T>(
    key: TKey,
    value: T[TKey] | undefined,
  ): void {
    if (value === undefined) return this.delete(key);
    this.store = Object.freeze({ ...this.store, [key]: value }) as T;
    this.syncStorage();
  }

  public delete(...keys: (keyof T)[]): void {
    this.store = Object.freeze(
      Object.fromEntries(
        Object.entries(this.store).filter(
          ([k]) => !keys.includes(k as keyof T),
        ),
      ),
    ) as T;
    this.syncStorage();
  }

  public clear(): void {
    this.store = Object.freeze({}) as T;
    this.syncStorage();
  }

  // --- PRIVATES ---

  private readStorage() {
    try {
      if (typeof globalThis.window !== "undefined") {
        const data = globalThis.window.localStorage.getItem(this.key);
        return Object.freeze(JSON.parse(data || "{}")) as T;
      }
      return {} as T;
    } catch {
      return {} as T;
    }
  }

  private syncStorage() {
    if (typeof globalThis.window !== "undefined") {
      globalThis.window.localStorage.setItem(
        this.key,
        JSON.stringify(this.store),
      );
    }
  }
}
