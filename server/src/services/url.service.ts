import { db } from "../db/knex";
import cacheService from "./cache.service";
import { generateSlug } from "../utils/slug.utils";

interface CreateUrlDto {
  original_url: string;
  slug?: string;
  expiration_date?: string;
}

interface UrlResponse {
  id: string;
  original_url: string;
  slug: string;
  expiration_date: string | null;
  created_at: string;
}

class UrlService {
  /**
   * Create a new shortened URL
   * Validates input, generates unique slug, stores in DB
   *
   * @param dto - Data transfer object with original_url and optional custom slug/expiration
   * @returns Created URL record
   */
  async createShortenedUrl(dto: CreateUrlDto): Promise<UrlResponse> {
    const slug = dto.slug || (await this.generateUniqueSlug());

    await this.validateSlugUniqueness(slug);

    const [created] = await db("urls")
      .insert({
        original_url: dto.original_url,
        slug,
        expiration_date: dto.expiration_date || null,
      })
      .returning([
        "id",
        "original_url",
        "slug",
        "expiration_date",
        "created_at",
      ]);

    return created;
  }

  /**
   * Retrieve a shortened URL and handle redirection logic
   * Manages cache, expiration checking, and analytics tracking
   *
   * @param slug - The shortened URL slug
   * @returns URL data or null if not found/expired
   */
  async getAndTrackUrl(slug: string) {
    const url = await cacheService.getLink(slug);

    if (!url) return null;

    this.incrementClickCountAsync(url.id);

    return url;
  }

  /**
   * Track expired access attempts without blocking redirect response
   * Useful for analytics on expired links
   *
   * @param slug - The slug that was accessed while expired
   */
  async trackExpiredAccess(slug: string): Promise<void> {
    this.incrementExpiredAccessCountAsync(slug);
  }

  private async generateUniqueSlug(): Promise<string> {
    let slug = generateSlug();
    let attempts = 0;
    const maxAttempts = 10;

    while ((await this.slugExists(slug)) && attempts < maxAttempts) {
      slug = generateSlug();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error("Failed to generate unique slug after multiple attempts");
    }

    return slug;
  }

  private async validateSlugUniqueness(slug: string): Promise<void> {
    const exists = await this.slugExists(slug);
    if (exists) {
      throw new Error(`Slug "${slug}" already exists`);
    }
  }

  private async slugExists(slug: string): Promise<boolean> {
    const result = await db("urls").where({ slug }).first();
    return !!result;
  }

  private incrementClickCountAsync(urlId: string): void {
    db("urls")
      .where({ id: urlId })
      .increment("click_count", 1)
      .catch((error) =>
        console.error("Error incrementing click count:", error),
      );
  }

  private incrementExpiredAccessCountAsync(slug: string): void {
    db("urls")
      .where({ slug })
      .increment("expired_access_count", 1)
      .catch((error) =>
        console.error("Error incrementing expired access count:", error),
      );
  }
}

const urlService = new UrlService();

export default urlService;
