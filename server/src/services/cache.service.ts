import { LRUCache } from "lru-cache";
import { db } from "../db/knex";
import { config } from "../config/index";
import { UtmParams } from "../utils/utm.utils";

interface CachedUrl {
  id: string;
  original_url: string;
  slug: string;
  expiration_date: string | null;
  utm_params?: UtmParams | null;
  click_count: number;
  expired_access_count: number;
  created_at: string;
  updated_at: string;
}

class UrlCacheService {
  private cache: LRUCache<string, CachedUrl>;
  private readonly DEFAULT_TTL_MS = config.cache.defaultTtlMs;
  private readonly MAX_ITEMS = config.cache.maxItems;

  constructor() {
    this.cache = new LRUCache<string, CachedUrl>({
      max: this.MAX_ITEMS,
      ttl: this.DEFAULT_TTL_MS,
      updateAgeOnGet: true,
    });
  }

  /**
   * Retrieve a shortened URL by slug with automatic cache management
   * Implements passive expiry strategy for high-performance redirects
   *
   * Logic flow:
   * 1. Check if URL exists in cache
   * 2. If cache miss, query database and return null if not found
   * 3. Check if URL is expired based on expiration_date
   * 4. If expired, delete from cache (passive cleanup) and return null
   * 5. Update cache with appropriate TTL (respecting individual expiration dates)
   * 6. Return URL data for redirection
   *
   * @param slug - The 8-character unique slug identifier
   * @returns URL data or null if not found or expired
   */
  async getLink(slug: string): Promise<CachedUrl | null> {
    const cached = this.cache.get(slug);
    const url = cached || (await this.fetchFromDatabase(slug));

    if (!url) return null;
    if (this.isExpired(url)) {
      this.cache.delete(slug);
      return null;
    }

    this.updateCacheEntry(slug, url);
    return url;
  }

  /**
   *
   * Manually remove a slug from cache
   * Useful for invalidating stale entries or testing
   *
   * @param slug - The slug to remove
   */
  deleteFromCache(slug: string): void {
    this.cache.delete(slug);
  }

  /**
   * Get cache statistics for monitoring and debugging
   *
   * @returns Object with current cache size, max capacity, and TTL configuration
   */
  getStats() {
    return {
      size: this.cache.size,
      max: this.cache.max,
      ttl: this.DEFAULT_TTL_MS,
    };
  }

  /**
   * Clear entire cache
   * Typically used in testing scenarios
   */
  clear(): void {
    this.cache.clear();
  }

  private async fetchFromDatabase(slug: string): Promise<CachedUrl | null> {
    try {
      return await db("urls").where({ slug }).first();
    } catch (error) {
      console.error(`Database error fetching slug: ${slug}`, error);
      return null;
    }
  }

  private isExpired(url: CachedUrl): boolean {
    if (!url.expiration_date) return false;
    return Date.now() > new Date(url.expiration_date).getTime();
  }

  private calculateOptimalTtl(expirationDate: string | null): number {
    if (!expirationDate) return this.DEFAULT_TTL_MS;

    const timeUntilExpiration = new Date(expirationDate).getTime() - Date.now();
    return Math.min(this.DEFAULT_TTL_MS, timeUntilExpiration);
  }

  private updateCacheEntry(slug: string, url: CachedUrl): void {
    const ttl = this.calculateOptimalTtl(url.expiration_date);
    this.cache.set(slug, url, { ttl });
  }
}

const cacheService = new UrlCacheService();

export default cacheService;
