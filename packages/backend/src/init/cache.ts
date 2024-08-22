import NodeCache from 'node-cache';

class CacheService {
  private readonly cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl === undefined) {
      return this.cache.set(key, value, 0);
    } else {
      return this.cache.set(key, value, ttl);
    }
  }

  del(keys: string | string[]): number {
    return this.cache.del(keys);
  }

  flush(): void {
    this.cache.flushAll();
  }
}

const cacheService = new CacheService(0);

// init
cacheService.set('network.hardhat.event.num', '0');
cacheService.set('network.sepolia.event.num', '0');
cacheService.set('network.amoy.event.num', '0');

export default cacheService;
