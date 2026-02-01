import { Request, Response } from "express";
import urlService from "../services/url.service";
import { config } from "../config";

class UrlController {
  /**
   * POST /api/shorten
   * Create a new shortened URL
   */
  async createShortenedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { original_url, slug, expiration_date, utm_params } = req.body;

      const created = await urlService.createShortenedUrl({
        original_url,
        slug,
        expiration_date,
        utm_params,
      });

      const shortenedUrl = `${config.server.baseUrl}/${created.slug}`;

      res.status(201).json({
        id: created.id,
        original_url: created.original_url,
        short_url: shortenedUrl,
        slug: created.slug,
        expiration_date: created.expiration_date,
        utm_params: created.utm_params,
        createdAt: created.createdAt,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ error: error.message });
        return;
      }

      console.error("Error creating shortened URL:", error);
      res.status(500).json({ error: "Failed to create shortened URL" });
    }
  }

  /**
   * GET /api/analytics/:slug
   * Get analytics data for a shortened URL
   */
  async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const analytics = await urlService.getAnalytics(slug);

      if (!analytics.url) {
        res.status(404).json({ error: "URL not found" });
        return;
      }

      res.status(200).json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  }

  /**
   * GET /:slug
   * Redirect to the original URL with analytics tracking
   * Handles found, not_found, and expired states appropriately
   */
  async redirectToOriginal(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const referrer = req.get("referer") || null;
      const userAgent = req.get("user-agent") || null;

      const { url, status } = await urlService.getAndTrackUrl(
        slug,
        referrer,
        userAgent,
      );

      if (status === "not_found") {
        res.redirect(`${config.frontend.url}/404`);
        return;
      }

      if (status === "expired") {
        res.redirect(`${config.frontend.url}/expired?slug=${slug}`);
        return;
      }

      if (!url) {
        res.redirect(`${config.frontend.url}/404`);
        return;
      }

      res.redirect(url.original_url);
    } catch (error) {
      console.error("Error redirecting URL:", error);
      res.redirect(`${config.frontend.url}/404`);
    }
  }
}

const urlController = new UrlController();

export default urlController;
