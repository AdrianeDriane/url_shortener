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
  if (slug.length !== 8) {
    return "Slug must be exactly 8 characters";
  }
  if (!/^[a-zA-Z0-9]+$/.test(slug)) {
    return "Slug can only contain letters and numbers";
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

export const validateUtmField = (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length > 100) {
    return "Maximum 100 characters";
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
    return "Only letters, numbers, dots, hyphens, and underscores allowed";
  }
  return undefined;
};
