export interface CachePort {
  del(key: string): Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
}
