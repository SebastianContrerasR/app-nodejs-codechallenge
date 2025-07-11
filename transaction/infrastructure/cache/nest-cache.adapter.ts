import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CachePort } from '../../domain/contracts/cache.port';

@Injectable()
export class NestCacheAdapter implements CachePort {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }
}
