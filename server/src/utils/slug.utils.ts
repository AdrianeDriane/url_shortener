import { customAlphabet } from "nanoid";

/**
 * Generate a cryptographically secure 8-character alphanumeric slug
 * Uses nanoid for collision-resistant URL-safe identifiers
 *
 * @returns 8-character slug
 */
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  8,
);

export function generateSlug(): string {
  return nanoid();
}

/**
 * Validate if a string is a valid URL
 *
 * @param url - The URL to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate if a slug matches the expected format (8 alphanumeric characters)
 *
 * @param slug - The slug to validate
 * @returns true if valid slug format, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  return /^[0-9a-zA-Z]{8}$/.test(slug);
}
