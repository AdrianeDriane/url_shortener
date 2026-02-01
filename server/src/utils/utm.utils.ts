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

  return hasOnlyValidKeys(utmParams) && allValuesAreStrings(utmParams);
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
