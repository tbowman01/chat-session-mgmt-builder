import { IMemoryStore } from './store.interface';

export class MemoryStore<T> implements IMemoryStore<T> {
  private readonly store = new Map<string, T>();

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  set(key: string, value: T): void {
    this.store.set(key, value);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }

  entries(): IterableIterator<[string, T]> {
    return this.store.entries();
  }

  values(): IterableIterator<T> {
    return this.store.values();
  }

  keys(): IterableIterator<string> {
    return this.store.keys();
  }
}