import { Request, Response, NextFunction } from "express";
import { isValidUrl, isValidSlug } from "../utils/slug.utils";
import { isValidUtmParams } from "../utils/utm.utils";
import { config } from "../config/index";

/**
 * Validate POST /api/shorten request body
 * Ensures original_url is present and valid
 */
export function validateShortenRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { original_url, slug, expiration_date, utm_params } = req.body;

  if (!original_url) {
    res.status(400).json({ error: "original_url is required" });
    return;
  }

  if (!isValidUrl(original_url)) {
    res.status(400).json({ error: "original_url must be a valid URL" });
    return;
  }

  if (slug && !isValidSlug(slug)) {
    res.status(400).json({ error: "slug must be 8 alphanumeric characters" });
    return;
  }

  if (expiration_date) {
    const expiryTime = new Date(expiration_date).getTime();
    if (isNaN(expiryTime)) {
      res.status(400).json({
        error:
          'Invalid expiration date format. Use ISO 8601 format (e.g., "2026-02-15T14:30:00")',
      });
      return;
    }
    if (expiryTime <= Date.now()) {
      res.status(400).json({ error: "Expiration date must be in the future" });
      return;
    }
  }

  if (utm_params && !isValidUtmParams(utm_params)) {
    res.status(400).json({
      error:
        "utm_params must be an object with valid UTM fields (source, medium, campaign, term, content)",
    });
    return;
  }

  next();
}

/**
 * Validate GET /:slug request params
 * Ensures slug matches expected format
 */
export function validateSlugParam(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { slug } = req.params;

  if (!isValidSlug(slug)) {
    res.redirect(`${config.frontend.url}/404`);
    return;
  }

  next();
}
