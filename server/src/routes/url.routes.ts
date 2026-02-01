import { Router } from "express";
import urlController from "../controllers/url.controller";
import {
  validateShortenRequest,
  validateSlugParam,
} from "../middleware/url-validation.middleware";

const router = Router();

/**
 * POST /api/shorten
 * Create a new shortened URL
 */
router.post("/api/shorten", validateShortenRequest, (req, res) =>
  urlController.createShortenedUrl(req, res),
);

/**
 * GET /:slug
 * Redirect to original URL with click tracking
 */
router.get("/:slug", validateSlugParam, (req, res) =>
  urlController.redirectToOriginal(req, res),
);

export default router;
