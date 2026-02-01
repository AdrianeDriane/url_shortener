import { Request, Response, NextFunction } from "express";
import { isValidUrl, isValidSlug } from "../utils/slug.utils";

/**
 * Validate POST /api/shorten request body
 * Ensures original_url is present and valid
 */
export function validateShortenRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { original_url, slug, expiration_date } = req.body;

  if (!original_url) {
    res.status(400).json({ error: "original_url is required" });
    return;
  }

  if (!isValidUrl(original_url)) {
    res.status(400).json({ error: "original_url must be a valid URL" });
    return;
  }

  if (slug && !isValidSlug(slug)) {
    res
      .status(400)
      .json({ error: "slug must be 8 alphanumeric characters" });
    return;
  }

  if (
    expiration_date &&
    new Date(expiration_date).getTime() <= Date.now()
  ) {
    res
      .status(400)
      .json({ error: "expiration_date must be in the future" });
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
    res.status(400).json({ error: "Invalid slug format" });
    return;
  }

  next();
}
