export const validateUrl = (url: string): string | undefined => {
  if (!url) {
    return "URL is required";
  }
  try {
    new URL(url);
    return undefined;
  } catch {
    return "Please enter a valid URL (e.g., https://example.com)";
  }
};

export const validateSlug = (slug: string): string | undefined => {
  if (!slug) return undefined;
  if (slug.length < 3) {
    return "Slug must be at least 3 characters";
  }
  if (slug.length > 20) {
    return "Slug must be 20 characters or less";
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
    return "Slug can only contain letters, numbers, hyphens, and underscores";
  }
  return undefined;
};

export const validateExpirationDate = (dateStr: string): string | undefined => {
  if (!dateStr) return undefined;
  const selectedDate = new Date(dateStr);
  const now = new Date();
  if (selectedDate <= now) {
    return "Expiration date must be in the future";
  }
  return undefined;
};
