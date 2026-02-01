# Backend Documentation

The backend is a RESTful API built with Express.js and TypeScript, following MVC architecture with a service layer for business logic.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [POST /api/shorten](#post-apishorten)
  - [GET /:slug](#get-slug)
  - [GET /api/analytics/:slug](#get-apianalyticsslug)
- [Core Systems](#core-systems)
  - [Caching System (LRU)](#caching-system-lru)
  - [UTM Parameter Management](#utm-parameter-management)
  - [Slug Generation](#slug-generation)
  - [Analytics Tracking](#analytics-tracking)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Key Design Decisions](#key-design-decisions)

---

## Tech Stack

| Technology | Purpose                                  |
| ---------- | ---------------------------------------- |
| Express.js | Web framework                            |
| TypeScript | Type safety (strict mode)                |
| PostgreSQL | Relational database                      |
| Knex.js    | Query builder & migrations               |
| lru-cache  | In-memory caching                        |
| nanoid     | Cryptographically secure slug generation |
| nodemon    | Development hot reload                   |

---

## Architecture

The application follows **MVC architecture** with a dedicated service layer:

```mermaid
flowchart LR
    A[Request] --> B[Routes]
    B --> C[Controllers]
    C --> D[Services]
    D --> E[(Database)]
    D --> F[Cache Layer]
```

**Flow for URL Redirect:**

1. Request hits route (`/:slug`)
2. Controller validates and delegates to service
3. Service checks LRU cache first (O(1) lookup)
4. On cache miss, queries PostgreSQL
5. Checks expiration, tracks analytics (non-blocking)
6. Returns redirect response

---

## Project Structure

```
src/
├── index.ts                          # Express app entry point
├── config/
│   └── index.ts                      # Centralized configuration
├── controllers/
│   └── url.controller.ts             # Request/response handlers
├── db/
│   ├── knex.ts                       # Database connection
│   ├── knexfile.js                   # Knex configuration
│   ├── create-db-migration.js        # Migration generator script
│   ├── migrations/                   # Database migrations
│   │   ├── 20250201120000_create-urls-table.js
│   │   ├── 20250201150000_create-clicks-table.js
│   │   └── 20250201160000_add-utm-params-to-urls.js
│   ├── seeds/                        # Database seeders
│   │   └── 001_demo_data.js
│   └── util/
│       └── db-util.js                # Database helper functions
├── middleware/
│   └── url-validation.middleware.ts  # Request validation
├── routes/
│   └── url.routes.ts                 # Route definitions
├── services/
│   ├── url.service.ts                # URL business logic
│   └── cache.service.ts              # LRU cache management
└── utils/
    ├── slug.utils.ts                 # Slug generation & validation
    └── utm.utils.ts                  # UTM parameter handling
```

---

## Database Schema

### `urls` Table

| Column                 | Type       | Description                           |
| ---------------------- | ---------- | ------------------------------------- |
| `id`                   | UUID       | Primary key (auto-generated)          |
| `original_url`         | TEXT       | Destination URL (UTM params stripped) |
| `slug`                 | VARCHAR(8) | Unique short code (indexed)           |
| `expiration_date`      | TIMESTAMP  | Optional expiration                   |
| `utm_params`           | JSONB      | Stored UTM parameters                 |
| `click_count`          | INTEGER    | Total redirect count                  |
| `expired_access_count` | INTEGER    | Attempts after expiration             |
| `created_at`           | TIMESTAMP  | Auto-generated                        |
| `updated_at`           | TIMESTAMP  | Auto-updated via trigger              |

### `clicks` Table

| Column       | Type      | Description                     |
| ------------ | --------- | ------------------------------- |
| `id`         | UUID      | Primary key                     |
| `url_id`     | UUID      | Foreign key → urls.id (CASCADE) |
| `referrer`   | TEXT      | HTTP Referer header             |
| `user_agent` | TEXT      | Browser/device info             |
| `created_at` | TIMESTAMP | Click timestamp                 |

**Indexes:**

- `urls.slug` — Unique index for fast lookups
- `clicks.url_id` — For analytics aggregation
- `clicks.created_at` — For time-based queries

---

## API Endpoints

### POST `/api/shorten`

Create a shortened URL.

**Request Body:**

```json
{
  "original_url": "https://example.com/page?id=123",
  "slug": "myslug01",
  "expiration_date": "2026-12-31T23:59:59Z",
  "utm_params": {
    "source": "twitter",
    "medium": "social",
    "campaign": "spring_sale"
  }
}
```

| Field             | Required | Description                     |
| ----------------- | -------- | ------------------------------- |
| `original_url`    | Yes      | Valid URL to shorten            |
| `slug`            | No       | Custom 8-char alphanumeric slug |
| `expiration_date` | No       | ISO 8601 future timestamp       |
| `utm_params`      | No       | UTM tracking parameters         |

**Response (201 Created):**

```json
{
  "id": "uuid-here",
  "original_url": "https://example.com/page?id=123",
  "short_url": "http://localhost:8000/abc12345",
  "slug": "abc12345",
  "expiration_date": "2026-12-31T23:59:59.000Z",
  "utm_params": { "source": "twitter", "medium": "social" },
  "createdAt": "2026-02-01T10:30:00.000Z"
}
```

**Error Responses:**

- `400` — Invalid URL format, slug format, or UTM params
- `409` — Slug already exists

---

### GET `/:slug`

Redirect to the original URL.

**Flow:**

1. Validate slug format (8 alphanumeric chars)
2. Check LRU cache → database fallback
3. If expired → redirect to `/expired?slug={slug}`
4. If not found → redirect to `/404`
5. Append stored UTM params to destination URL
6. Track click asynchronously (non-blocking)
7. Return 302 redirect

**Example:**

```
GET /abc12345
→ 302 Redirect to https://example.com/page?utm_source=twitter&utm_campaign=promo
```

---

### GET `/api/analytics/:slug`

Get analytics for a shortened URL.

**Response (200 OK):**

```json
{
  "url": {
    "id": "uuid",
    "original_url": "https://example.com",
    "slug": "abc12345",
    "expiration_date": null,
    "utm_params": { "source": "twitter" },
    "click_count": 42,
    "expired_access_count": 3,
    "createdAt": "2026-02-01T10:30:00.000Z"
  },
  "clicks": [
    {
      "id": "click-uuid",
      "referrer": "https://twitter.com/",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2026-02-01T12:00:00.000Z"
    }
  ],
  "isExpired": false
}
```

---

## Core Systems

### Caching System (LRU)

The backend implements an **LRU (Least Recently Used) cache** for high-performance URL lookups.

#### What is LRU Cache?

LRU is a cache eviction policy that removes the **least recently accessed** items when the cache reaches capacity. This ensures frequently accessed URLs stay in memory while rarely used ones are evicted.

#### Configuration

```typescript
const cache = new LRUCache<string, CachedUrl>({
  max: 1000, // Maximum 1000 items
  ttl: 300000, // 5 minute TTL (time-to-live)
  updateAgeOnGet: true, // Refresh TTL on access
});
```

#### How It Works

```mermaid
flowchart TD
    A["Request for /abc12345"] --> B["LRU Cache\n(in-memory)"]
    B --> C{Cache Hit?}
    C -->|Yes| D[Return cached URL]
    C -->|No| E[(PostgreSQL)]
    E --> F["Store in Cache\n(with smart TTL)"]
    F --> G[Return URL]

    style B fill:#e1f5fe
    style E fill:#fff3e0
```

#### Passive Expiry Strategy

The cache implements **passive expiry** — expired URLs are only removed when accessed:

```typescript
async getLink(slug: string): Promise<CachedUrl | null> {
  // 1. Check cache first
  let url = this.cache.get(slug);

  // 2. Cache miss → query database
  if (!url) {
    url = await db("urls").where({ slug }).first();
    if (!url) return null;
  }

  // 3. Check if URL has expired
  if (url.expiration_date && new Date(url.expiration_date) < new Date()) {
    this.cache.delete(slug);  // Remove stale entry
    return null;              // Treat as not found
  }

  // 4. Calculate smart TTL
  const ttl = url.expiration_date
    ? Math.min(DEFAULT_TTL, timeUntilExpiration)
    : DEFAULT_TTL;

  // 5. Store/refresh in cache
  this.cache.set(slug, url, { ttl });

  return url;
}
```

#### Benefits

| Benefit                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| **O(1) Lookups**          | Hash map provides constant-time access       |
| **Memory Efficient**      | Automatic eviction prevents unbounded growth |
| **Smart TTL**             | URLs expiring soon get shorter cache TTL     |
| **No Stale Data**         | Expiration checked on every access           |
| **Hot Path Optimization** | Frequently accessed URLs stay cached         |

---

### UTM Parameter Management

UTM (Urchin Tracking Module) parameters are handled with a clean separation strategy.

#### Supported Parameters

| Parameter      | Purpose              | Example                           |
| -------------- | -------------------- | --------------------------------- |
| `utm_source`   | Traffic source       | `twitter`, `google`, `newsletter` |
| `utm_medium`   | Marketing medium     | `social`, `email`, `cpc`          |
| `utm_campaign` | Campaign name        | `spring_sale`, `product_launch`   |
| `utm_term`     | Paid search keywords | `running+shoes`                   |
| `utm_content`  | A/B test variant     | `banner_v1`, `sidebar`            |

#### Processing Flow

```mermaid
flowchart TD
    A["Input URL\nhttps://example.com/page?utm_source=old&foo=bar"] --> B[extractUtmParams]
    B --> C["Extracted: { source: 'old' }"]
    C --> D[removeUtmParams]
    D --> E["Cleaned URL\nhttps://example.com/page?foo=bar"]
    E --> F["mergeUtmParams(extracted, dto.utm_params)"]
    F --> G["Final UTM: { source: 'new', campaign: 'promo' }\n(DTO wins)"]
    G --> H[(Database Storage)]
    H --> I["Stored:\noriginal_url = '.../page?foo=bar'\nutm_params = { source: 'new', campaign: 'promo' }"]

    style A fill:#fff3e0
    style H fill:#e8f5e9
    style I fill:#e8f5e9
```

#### On Redirect

```mermaid
flowchart TD
    A["Stored URL\nhttps://example.com/page?foo=bar"] --> C[appendUtmParams]
    B["Stored UTM\n{ source: 'twitter', campaign: 'promo' }"] --> C
    C --> D["Final Redirect\nhttps://example.com/page?foo=bar&utm_source=twitter&utm_campaign=promo"]

    style A fill:#e3f2fd
    style B fill:#e3f2fd
    style D fill:#c8e6c9
```

---

### Slug Generation

Slugs are generated using `nanoid` with a custom base62 alphabet.

#### Configuration

```typescript
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8,
);
```

#### Properties

| Property              | Value                          |
| --------------------- | ------------------------------ |
| Length                | 8 characters                   |
| Alphabet              | Base62 (0-9, A-Z, a-z)         |
| Entropy               | ~47.6 bits                     |
| Collision-resistant   | Yes (cryptographically secure) |
| Possible combinations | 62^8 = 218 trillion            |

#### Collision Handling

```typescript
async function generateUniqueSlug(): Promise<string> {
  const MAX_ATTEMPTS = 10;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const slug = nanoid();
    const exists = await db("urls").where({ slug }).first();
    if (!exists) return slug;
  }

  throw new Error("Failed to generate unique slug");
}
```

---

### Analytics Tracking

Analytics are tracked **asynchronously** to avoid blocking the redirect response.

#### Fire-and-Forget Pattern

```typescript
// Non-blocking — doesn't delay the redirect
private incrementClickCountAsync(urlId: string): void {
  db("urls")
    .where({ id: urlId })
    .increment("click_count", 1)
    .catch(err => console.error("Click count error:", err));
}

private trackClickAsync(
  urlId: string,
  referrer: string | null,
  userAgent: string | null
): void {
  db("clicks")
    .insert({ url_id: urlId, referrer, user_agent: userAgent })
    .catch(err => console.error("Click tracking error:", err));
}
```

#### Tracked Data

- **Click Count** — Total redirects per URL
- **Referrer** — Where the user came from (HTTP Referer header)
- **User Agent** — Browser/device information
- **Timestamp** — When the click occurred
- **Expired Access Count** — Attempts to access expired URLs

---

## Validation

### Request Validation Middleware

| Field             | Validation Rules                                         |
| ----------------- | -------------------------------------------------------- |
| `original_url`    | Required, valid URL format                               |
| `slug`            | Optional, exactly 8 alphanumeric characters              |
| `expiration_date` | Optional, must be a future date                          |
| `utm_params`      | Optional, object with valid UTM keys only, string values |

### Slug Validation

```typescript
const SLUG_REGEX = /^[0-9a-zA-Z]{8}$/;

function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}
```

---

## Error Handling

| Status                      | Scenario                                     |
| --------------------------- | -------------------------------------------- |
| `400 Bad Request`           | Invalid URL, slug format, or UTM params      |
| `404 Not Found`             | URL not found (via redirect to `/404`)       |
| `409 Conflict`              | Custom slug already exists                   |
| `410 Gone`                  | URL has expired (via redirect to `/expired`) |
| `500 Internal Server Error` | Database or server error                     |

---

## Scripts

```bash
# Start development server (with hot reload)
npm start

# Run all pending migrations
npm run migration:latest

# Rollback last migration batch
npm run migration:rollback

# Check migration status
npm run migration:status

# Create new migration
npm run migration:new -- migration_name

# Run database seeder
npm run seed:run
```

---

## Configuration

Environment variables (via `.env`):

```env
# Server
PORT=8000
NODE_ENV=development
SERVER_BASE_URL=http://localhost:8000

# Database
DB_CONNECTION_URI=postgres://user:pass@localhost:5432/dbname

# Frontend (for redirects)
FRONTEND_URL=http://localhost:3000
```

Configuration object (`config/index.ts`):

```typescript
export const config = {
  server: {
    port: process.env.PORT || 8000,
    nodeEnv: process.env.NODE_ENV || "development",
    baseUrl: process.env.SERVER_BASE_URL || "http://localhost:8000",
  },
  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:3000",
  },
  cache: {
    maxItems: 1000,
    defaultTtlMs: 300000, // 5 minutes
  },
};
```

---

## Key Design Decisions

### 1. Cache-First Architecture

All URL lookups hit the LRU cache before the database, providing O(1) access for hot URLs and reducing database load.

### 2. Passive Expiry

Expired URLs are not proactively cleaned. Instead, expiration is checked on access, simplifying the system and avoiding background jobs.

### 3. Fire-and-Forget Analytics

Click tracking is asynchronous and non-blocking. A failed analytics insert doesn't affect the user's redirect experience.

### 4. UTM Separation

UTM parameters are stripped from URLs and stored separately in JSONB. This keeps URLs clean and allows UTM modification without changing the stored URL.

### 5. Cryptographic Slug Generation

Using `nanoid` with a custom alphabet provides better entropy than sequential IDs or simple random strings, making slugs unpredictable.

### 6. Service Layer Pattern

Business logic lives in the service layer, keeping controllers thin and making the code testable and maintainable.

### 7. Validation at the Edge

All input validation happens in middleware before reaching controllers, ensuring consistent error responses and clean controller code.
