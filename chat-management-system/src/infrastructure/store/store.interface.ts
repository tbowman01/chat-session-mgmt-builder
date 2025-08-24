export interface IMemoryStore<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  size(): number;
  entries(): IterableIterator<[string, T]>;
  values(): IterableIterator<T>;
  keys(): IterableIterator<string>;
}