import { db } from "../db/knex";
import cacheService from "./cache.service";
import { generateSlug } from "../utils/slug.utils";
import {
  UtmParams,
  appendUtmParams,
  extractUtmParams,
  removeUtmParams,
  mergeUtmParams,
} from "../utils/utm.utils";

interface CreateUrlDto {
  original_url: string;
  slug?: string;
  expiration_date?: string;
  utm_params?: UtmParams | null;
}

interface UrlResponse {
  id: string;
  original_url: string;
  slug: string;
  expiration_date: string | null;
  utm_params?: UtmParams | null;
  createdAt: string;
}

interface GetUrlResult {
  url: {
    id: string;
    original_url: string;
    slug: string;
    expiration_date: string | null;
    utm_params?: UtmParams | null;
  } | null;
  status: "found" | "not_found" | "expired";
}

class UrlService {
  /**
   * Create a new shortened URL with automatic UTM extraction and cleaning
   *
   * Process:
   * 1. Validate expiration_date format and ensure it's in the future
   * 2. Extract UTM params from original_url query string
   * 3. Clean UTM params from original_url (keeps URL clean)
   * 4. Merge extracted params with DTO params (DTO takes precedence)
   * 5. Store cleaned URL and merged UTM params separately
   *
   * @param dto - Data transfer object with original_url and optional custom slug/expiration/utm_params
   * @returns Created URL record with cleaned original_url and extracted utm_params
   *
   * @example
   * Input: { original_url: "https://example.com?utm_source=twitter&foo=bar" }
   * Stored: { original_url: "https://example.com?foo=bar", utm_params: { source: "twitter" } }
   */
  async createShortenedUrl(dto: CreateUrlDto): Promise<UrlResponse> {
    const slug = dto.slug || (await this.generateUniqueSlug());

    await this.validateSlugUniqueness(slug);

    const extractedUtmParams = extractUtmParams(dto.original_url);
    const cleanedUrl = removeUtmParams(dto.original_url);
    const finalUtmParams = mergeUtmParams(extractedUtmParams, dto.utm_params);

    const [created] = await db("urls")
      .insert({
        original_url: cleanedUrl,
        slug,
        expiration_date: dto.expiration_date || null,
        utm_params: finalUtmParams,
      })
      .returning([
        "id",
        "original_url",
        "slug",
        "expiration_date",
        "utm_params",
        "createdAt",
      ]);

    return created;
  }

  /**
   * Retrieve a shortened URL and handle redirection logic
   * Manages cache, expiration checking, and analytics tracking
   *
   * Logic flow:
   * 1. Get URL from cache with status
   * 2. If not found, return not_found status
   * 3. If expired, track expired access and return expired status with URL data
   * 4. If found, increment click count and record click details
   * 5. Return URL data with status
   *
   * @param slug - The shortened URL slug
   * @param referrer - Optional HTTP Referer header value
   * @param userAgent - Optional HTTP User-Agent header value
   * @returns Object with URL data and status
   */
  async getAndTrackUrl(
    slug: string,
    referrer?: string | null,
    userAgent?: string | null,
  ): Promise<GetUrlResult> {
    const { url, status } = await cacheService.getLink(slug);

    if (status === "not_found" || !url) {
      return { url: null, status: "not_found" };
    }

    if (status === "expired") {
      // Track expired access attempt
      this.incrementExpiredAccessCountAsync(slug);
      this.trackClickAsync(url.id, referrer || null, userAgent || null);
      return { url, status: "expired" };
    }

    // Valid URL - track the click
    this.incrementClickCountAsync(url.id);
    this.trackClickAsync(url.id, referrer || null, userAgent || null);

    if (url.utm_params) {
      url.original_url = appendUtmParams(url.original_url, url.utm_params);
    }

    return { url, status: "found" };
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

  /**
   * Get analytics data for a specific shortened URL
   * Includes URL metadata, click counts, and click logs
   *
   * @param slug - The shortened URL slug
   * @returns Analytics data including URL info and click logs
   */
  async getAnalytics(slug: string): Promise<{
    url: {
      id: string;
      original_url: string;
      slug: string;
      expiration_date: string | null;
      utm_params: UtmParams | null;
      click_count: number;
      expired_access_count: number;
      createdAt: string;
    } | null;
    clicks: {
      id: string;
      referrer: string | null;
      user_agent: string | null;
      created_at: string;
    }[];
    isExpired: boolean;
  }> {
    const url = await db("urls")
      .where({ slug })
      .select(
        "id",
        "original_url",
        "slug",
        "expiration_date",
        "utm_params",
        "click_count",
        "expired_access_count",
        "createdAt",
      )
      .first();

    if (!url) {
      return { url: null, clicks: [], isExpired: false };
    }

    const isExpired = url.expiration_date
      ? new Date(url.expiration_date) < new Date()
      : false;

    const clicks = await db("clicks")
      .where({ url_id: url.id })
      .select("id", "referrer", "user_agent", "created_at")
      .orderBy("created_at", "desc");

    return { url, clicks, isExpired };
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

  private trackClickAsync(
    urlId: string,
    referrer: string | null,
    userAgent: string | null,
  ): void {
    db("clicks")
      .insert({
        url_id: urlId,
        referrer,
        user_agent: userAgent,
      })
      .catch((error) => console.error("Error recording click:", error));
  }
}

const urlService = new UrlService();

export default urlService;
