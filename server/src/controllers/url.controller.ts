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
      const { original_url, slug, expiration_date } = req.body;

      const created = await urlService.createShortenedUrl({
        original_url,
        slug,
        expiration_date,
      });

      const shortenedUrl = `${config.server.baseUrl}/${created.slug}`;

      res.status(201).json({
        id: created.id,
        original_url: created.original_url,
        short_url: shortenedUrl,
        slug: created.slug,
        expiration_date: created.expiration_date,
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
   * GET /:slug
   * Redirect to the original URL with analytics tracking
   */
  async redirectToOriginal(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const url = await urlService.getAndTrackUrl(slug);

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

  /**
   * GET /:slug/expired
   * Handle expired URL access
   */
  async handleExpiredUrl(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      await urlService.trackExpiredAccess(slug);

      res.redirect(`${config.frontend.url}/expired?slug=${slug}`);
    } catch (error) {
      console.error("Error handling expired URL:", error);
      res.redirect(`${config.frontend.url}/404`);
    }
  }
}

const urlController = new UrlController();

export default urlController;
