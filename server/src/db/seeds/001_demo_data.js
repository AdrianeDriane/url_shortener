/**
 * Production-Ready Demo Data Seeder
 *
 * This seeder populates the database with initial demo data for a
 * first-time setup experience. It is idempotent - it will only run
 * if the urls table is completely empty.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// ============================================================================
// Demo Data Configuration
// ============================================================================

const DEMO_URLS = [
  {
    original_url: "https://github.com/features/copilot",
    slug: "ghcopilt",
    expiration_date: null,
    utm_params: null,
    click_count: 0,
    expired_access_count: 0,
  },
  {
    original_url: "https://symphdev.com/portfolio",
    slug: "symphdev",
    expiration_date: null,
    utm_params: null,
    click_count: 0,
    expired_access_count: 0,
  },
  {
    original_url: "https://nextjs.org/docs/getting-started",
    slug: "nextdocs",
    expiration_date: null,
    utm_params: {
      source: "twitter",
      medium: "social",
      campaign: "launch2026",
      term: "nextjs",
      content: "docs-link",
    },
    click_count: 0,
    expired_access_count: 0,
  },
  {
    original_url: "https://example.com/old-promo",
    slug: "oldpromo",
    expiration_date: new Date("2025-01-01T00:00:00Z"), // Already expired
    utm_params: {
      source: "newsletter",
      medium: "email",
      campaign: "blackfriday2024",
    },
    click_count: 0,
    expired_access_count: 3, // Simulates users who tried to access after expiration
  },
  {
    original_url: "https://react.dev/learn",
    slug: "reactlrn",
    expiration_date: new Date("2027-12-31T23:59:59Z"), // Future expiration
    utm_params: null,
    click_count: 0,
    expired_access_count: 0,
  },
];

// URLs that will have click analytics generated (by slug)
const URLS_WITH_CLICKS = ["ghcopilt", "symphdev", "nextdocs"];

// Sample data for generating realistic click entries
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
];

const REFERRERS = [
  "https://twitter.com/",
  "https://x.com/",
  "https://www.linkedin.com/feed/",
  "https://www.facebook.com/",
  "https://www.reddit.com/r/programming/",
  "https://news.ycombinator.com/",
  "https://slack.com/",
  "https://www.google.com/search?q=url+shortener",
  null, // Direct traffic
  null, // Direct traffic
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Returns a random element from an array
 */
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a random date within the past N days
 */
function randomDateWithinDays(days) {
  const now = Date.now();
  const pastMs = days * 24 * 60 * 60 * 1000;
  const randomMs = Math.floor(Math.random() * pastMs);
  return new Date(now - randomMs);
}

/**
 * Generates click entries for a given URL
 */
function generateClicks(urlId, count) {
  const clicks = [];
  for (let i = 0; i < count; i++) {
    clicks.push({
      url_id: urlId,
      referrer: randomFrom(REFERRERS),
      user_agent: randomFrom(USER_AGENTS),
      created_at: randomDateWithinDays(30), // Clicks within last 30 days
    });
  }
  return clicks;
}

// ============================================================================
// Seed Function
// ============================================================================

exports.seed = async function (knex) {
  // -------------------------------------------------------------------------
  // Idempotency Check: Exit if data already exists
  // -------------------------------------------------------------------------
  const existingUrls = await knex("urls").count("id as count").first();
  const urlCount = parseInt(existingUrls.count, 10);

  if (urlCount > 0) {
    console.log(
      `⏭️  Skipping seed: Database already contains ${urlCount} URL(s).`,
    );
    return;
  }

  console.log("🌱 Seeding demo data...");

  // -------------------------------------------------------------------------
  // Insert Demo URLs
  // -------------------------------------------------------------------------
  const insertedUrls = await knex("urls")
    .insert(DEMO_URLS)
    .returning(["id", "slug"]);

  console.log(`✅ Inserted ${insertedUrls.length} demo URLs`);

  // Create a slug -> id map for click generation
  const slugToId = {};
  for (const url of insertedUrls) {
    slugToId[url.slug] = url.id;
  }

  // -------------------------------------------------------------------------
  // Generate Click Analytics
  // -------------------------------------------------------------------------
  const allClicks = [];

  for (const slug of URLS_WITH_CLICKS) {
    const urlId = slugToId[slug];
    if (!urlId) {
      console.warn(
        `⚠️  Warning: URL with slug "${slug}" not found, skipping clicks.`,
      );
      continue;
    }

    // Generate 5-10 random clicks per URL
    const clickCount = Math.floor(Math.random() * 6) + 5; // 5-10
    const clicks = generateClicks(urlId, clickCount);
    allClicks.push(...clicks);
  }

  if (allClicks.length > 0) {
    await knex("clicks").insert(allClicks);
    console.log(`✅ Inserted ${allClicks.length} click records`);

    // Update click_count on URLs to match inserted clicks
    for (const slug of URLS_WITH_CLICKS) {
      const urlId = slugToId[slug];
      if (!urlId) continue;

      const clickCountForUrl = allClicks.filter(
        (c) => c.url_id === urlId,
      ).length;
      await knex("urls")
        .where("id", urlId)
        .update({ click_count: clickCountForUrl });
    }
    console.log("✅ Updated click counts on URLs");
  }

  console.log("🎉 Demo data seeding complete!");
};
