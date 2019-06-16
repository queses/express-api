import * as cache from 'cache-manager'
import * as redisStore from "cache-manager-redis"
import { EnvUtil } from '../utils/EnvUtil'
import { LangUtil } from '../utils/LangUtil'
import { Service } from 'typedi'

const DEFAULT_MAX_IN_MEMORY = 999
const DEFAULT_MAX_IN_REDIS = 9999
const DEFAULT_CACHE_TTL = 600
const REDIS_ENABLED = EnvUtil.parseBoolean(process.env.REDIS_ENABLED)
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_DB = process.env.REDIS_DB_CACHE
const REDIS_PORT = EnvUtil.parseInt(process.env.REDIS_PORT)
const OPERATION_TIMEOUT_MS = 5000
const REDIS_KEY_PREFIX = 'lx-node:cache:'

@Service()
export class AppCache {
  private readonly manager: cache.Cache
  private readonly keyPrefix: string = ''

  constructor () {
    const conf: cache.StoreConfig | any = {
      ttl: DEFAULT_CACHE_TTL,
      store: 'memory',
      max: DEFAULT_MAX_IN_MEMORY
    }

    if (REDIS_ENABLED) {
      conf.store = redisStore
      conf.max = DEFAULT_MAX_IN_REDIS
      conf.host = REDIS_HOST
      conf.port = REDIS_PORT
      conf.db = REDIS_DB
      this.keyPrefix = REDIS_KEY_PREFIX
    }

    this.manager = cache.caching(conf)
  }

  public async get<V> (key: string, keyPrefix?: string): Promise<V> {
    const result = await this.waitForOperation(
      this.manager.get(this.prefixKey(key, keyPrefix)),
      'Timeout exceeded while reading from app cache'
    )

    return (result && typeof result === 'object' && REDIS_ENABLED) ? this.returnFromRedis(result) : result
  }

  public async set<V> (key: string, value: V, keyPrefix?: string, ttl: number = DEFAULT_CACHE_TTL): Promise<void> {
    const promise = this.manager.set(this.prefixKey(key, keyPrefix), value, { ttl }) as any
    return this.waitForOperation<any>(
      promise,
      'Timeout exceeded while writing in app cache'
    )
  }

  public async updateTtl (key: string, keyPrefix: string = '', ttl: number = DEFAULT_CACHE_TTL) {
    this.waitForOperation(
      this.performUpdateTtl(key, keyPrefix, ttl),
      'Timeout exceeded while updating TTL in app cache',
      OPERATION_TIMEOUT_MS * 2
    )
  }

  private returnFromRedis <R extends any> (res: R) {
    if (res.type === 'Buffer') {
      return Buffer.from(res.data)
    } else {
      return res
    }
  }

  private prefixKey (key: string, otherPrefix: string = '') {
    return this.keyPrefix + otherPrefix + key
  }

  private async performUpdateTtl (key: string, keyPrefix: string, ttl: number) {
    const prefixedKey = this.prefixKey(key, keyPrefix)
    const value = await this.manager.get(prefixedKey)
    if (typeof value !== 'undefined') {
      await this.manager.set(prefixedKey, value, { ttl })
    }
  }

  private waitForOperation <V> (operationPromise: Promise<V | void>, timeoutMessage: string, timeoutMs: number = OPERATION_TIMEOUT_MS) {
    if (!REDIS_ENABLED) {
      return operationPromise
    } else {
      return Promise.race([
        operationPromise,
        LangUtil.getRaceTimeout(timeoutMs, timeoutMessage)
      ])
    }
  }
}
