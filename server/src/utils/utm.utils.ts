export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// Constants
const VALID_UTM_KEYS: readonly string[] = [
  "source",
  "medium",
  "campaign",
  "term",
  "content",
] as const;

const UTM_PREFIX = "utm_";

const UTM_FIELD_TO_PARAM: Record<keyof UtmParams, string> = {
  source: `${UTM_PREFIX}source`,
  medium: `${UTM_PREFIX}medium`,
  campaign: `${UTM_PREFIX}campaign`,
  term: `${UTM_PREFIX}term`,
  content: `${UTM_PREFIX}content`,
};

const UTM_PARAM_TO_FIELD: Record<string, keyof UtmParams> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_term: "term",
  utm_content: "content",
};

/**
 * Append UTM parameters to a URL
 * Handles existing query strings safely using Node.js URL API
 *
 * @param originalUrl - The base URL to append UTM params to
 * @param utmParams - UTM tracking parameters object
 * @returns URL with UTM params appended
 *
 * @example
 * appendUtmParams("https://example.com/page", { source: "twitter", campaign: "promo" })
 * Returns: "https://example.com/page?utm_source=twitter&utm_campaign=promo"
 */
export function appendUtmParams(
  originalUrl: string,
  utmParams: UtmParams | null,
): string {
  if (!utmParams) return originalUrl;

  try {
    const url = new URL(originalUrl);
    appendUtmParamsToUrl(url, utmParams);
    return url.toString();
  } catch (error) {
    console.error("Invalid URL for UTM appending:", error);
    return originalUrl;
  }
}

/**
 * Validate UTM parameters object
 * Ensures only valid UTM fields are present and all values are strings
 *
 * @param utmParams - Object to validate
 * @returns Type guard: true if valid UtmParams or null/undefined, false otherwise
 */
export function isValidUtmParams(utmParams: any): utmParams is UtmParams {
  if (utmParams === null || utmParams === undefined) return true;

  if (!isObject(utmParams)) return false;

  if (!hasOnlyValidKeys(utmParams) || !allValuesAreStrings(utmParams)) {
    return false;
  }

  // Validate each UTM field value
  // Max 100 characters, only alphanumeric, dots, hyphens, underscores
  return Object.values(utmParams).every((value) => {
    if (typeof value !== "string") return false;
    if (value.length > 100) return false;
    return /^[a-zA-Z0-9._-]+$/.test(value);
  });
}

/**
 * Extract UTM parameters from a URL string
 * Parses query string and extracts utm_* parameters into internal schema
 *
 * @param urlString - URL to extract UTM params from
 * @returns Extracted UTM params or null if none found
 *
 * @example
 * extractUtmParams("https://example.com?utm_source=twitter&foo=bar")
 * Returns: { source: "twitter" }
 */
export function extractUtmParams(urlString: string): UtmParams | null {
  try {
    const url = new URL(urlString);
    const extracted: UtmParams = {};
    let hasUtmParams = false;

    Object.entries(UTM_PARAM_TO_FIELD).forEach(([urlParam, fieldKey]) => {
      const value = url.searchParams.get(urlParam);
      if (value) {
        extracted[fieldKey] = value;
        hasUtmParams = true;
      }
    });

    return hasUtmParams ? extracted : null;
  } catch (error) {
    return null;
  }
}

/**
 * Remove UTM parameters from a URL string
 * Cleans all utm_* query parameters while preserving other params
 *
 * @param urlString - URL to clean
 * @returns URL with UTM params removed
 *
 * @example
 * removeUtmParams("https://example.com?utm_source=twitter&foo=bar")
 * Returns: "https://example.com?foo=bar"
 */
export function removeUtmParams(urlString: string): string {
  try {
    const url = new URL(urlString);

    Object.keys(UTM_PARAM_TO_FIELD).forEach((utmParam) => {
      url.searchParams.delete(utmParam);
    });

    return url.toString();
  } catch (error) {
    return urlString;
  }
}

/**
 * Merge UTM parameters with precedence rules
 * DTO params take precedence over extracted params
 *
 * @param extractedParams - UTM params extracted from URL
 * @param dtoParams - UTM params provided in request DTO
 * @returns Merged UTM params with DTO taking precedence
 *
 * @example
 * mergeUtmParams({ source: "url" }, { source: "dto", campaign: "new" })
 * Returns: { source: "dto", campaign: "new" }
 */
export function mergeUtmParams(
  extractedParams: UtmParams | null,
  dtoParams: UtmParams | null | undefined,
): UtmParams | null {
  if (!extractedParams && !dtoParams) return null;
  if (!extractedParams) return dtoParams || null;
  if (!dtoParams) return extractedParams;

  return { ...extractedParams, ...dtoParams };
}

// Helper type predicates
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Helper validators
function hasOnlyValidKeys(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).every((key) => VALID_UTM_KEYS.includes(key));
}

function allValuesAreStrings(obj: Record<string, unknown>): boolean {
  return Object.values(obj).every(isString);
}

// Internal implementation
function appendUtmParamsToUrl(url: URL, utmParams: UtmParams): void {
  Object.entries(utmParams)
    .filter((entry): entry is [keyof UtmParams, string] => isDefined(entry[1]))
    .forEach(([key, value]) => {
      const paramName = UTM_FIELD_TO_PARAM[key];
      url.searchParams.set(paramName, value);
    });
}
