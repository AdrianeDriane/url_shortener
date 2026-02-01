# Frontend Documentation

The frontend is a React single-page application built with TypeScript, Vite, and Tailwind CSS.

## Tech Stack

| Technology    | Purpose                  |
| ------------- | ------------------------ |
| React         | UI library               |
| TypeScript    | Type safety              |
| Vite          | Build tool & dev server  |
| Tailwind CSS  | Utility-first styling    |
| Framer Motion | Animations & transitions |
| React Router  | Client-side routing      |
| Axios         | HTTP client              |
| Recharts      | Data visualization       |
| Lucide React  | Icon library             |
| qrcode.react  | QR code generation       |
| Sonner        | Toast notifications      |

---

## Project Structure

```
src/
├── config/                 # App configuration
│   └── api.ts              # API base URL config
├── features/               # Feature-based modules
│   ├── analytics/          # Analytics dashboard feature
│   │   ├── components/     # Analytics UI components
│   │   └── utils/          # Analytics helper functions
│   └── shortener/          # URL shortening feature
│       ├── components/     # Shortener UI components
│       └── utils/          # Validation utilities
├── layouts/                # Layout components
│   ├── MainLayout.tsx      # Main app layout wrapper
│   └── components/         # Layout sub-components (Header, Footer)
├── pages/                  # Route page components
├── router/                 # React Router configuration
├── services/               # API service layer
│   └── url.service.ts      # URL shortening & analytics API calls
├── types/                  # Shared TypeScript types
│   └── api.types.ts        # API request/response types
├── App.tsx                 # Root app component
├── main.tsx                # App entry point
└── index.css               # Global styles & Tailwind imports
```

---

## Pages

| Page                     | Route                   | Description                                |
| ------------------------ | ----------------------- | ------------------------------------------ |
| `HomePage`               | `/`                     | Main landing page with URL shortening form |
| `DashboardIndexPage`     | `/dashboard`            | Search for a short code to view analytics  |
| `DashboardAnalyticsPage` | `/dashboard/:shortCode` | Analytics dashboard for a specific URL     |
| `ExpiredPage`            | `/expired`              | Shown when accessing an expired link       |
| `NotFoundPage`           | `/404`                  | 404 error page                             |

---

## Features

### Shortener Feature (`features/shortener/`)

Components for the URL shortening functionality:

| Component          | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `URLComposer`      | Main form for inputting URLs and submitting                  |
| `AdvancedSettings` | Expandable panel for custom slug, expiration, and UTM params |
| `SuccessState`     | Displays the shortened URL with copy button and QR code      |
| `Tooltip`          | Reusable tooltip component for help text                     |

**Utilities:**

- `validation.ts` — URL validation, slug validation, expiration date validation, UTM field validation

### Analytics Feature (`features/analytics/`)

Components for the analytics dashboard:

| Component            | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `AnalyticsDashboard` | Main dashboard with bento grid layout showing all stats |
| `ActivityModal`      | Modal displaying recent click activity log              |
| `ReferrerDrawer`     | Side drawer with traffic source breakdown and pie chart |
| `ScrollReveal`       | Animation wrapper for scroll-triggered reveals          |
| `SkeletonCard`       | Loading skeleton placeholder                            |

**Utilities:**

- `analytics.utils.ts` — Date formatting, referrer parsing, device detection, stats calculation

---

## Services

### `url.service.ts`

Centralized API service using Axios:

```typescript
// Create a shortened URL
urlService.createShortenedUrl(payload: ShortenRequestPayload): Promise<ShortenResponse | null>

// Get analytics for a URL
urlService.getAnalytics(slug: string): Promise<AnalyticsResponse | null>
```

- Handles error responses with toast notifications
- Configurable base URL via `config/api.ts`

---

## Types (`types/api.types.ts`)

Shared TypeScript interfaces:

```typescript
interface ShortenRequestPayload {
  original_url: string;
  slug?: string;
  expiration_date?: string;
  utm_params?: Record<string, string>;
}

interface ShortenResponse {
  id: string;
  original_url: string;
  short_url: string;
  slug: string;
  expiration_date?: string;
  utm_params?: Record<string, string>;
  createdAt: string;
}

interface ClickLog {
  id: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AnalyticsResponse {
  url: UrlDetails | null;
  clicks: ClickLog[];
  isExpired: boolean;
}
```

---

## Scripts

```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## Styling

- **Tailwind CSS** for utility-first styling
- **Custom color palette** using zinc, indigo, and violet
- **Responsive design** with mobile-first breakpoints (`sm:`, `md:`, `lg:`)
- **Framer Motion** for smooth animations and page transitions

---

## Key Design Decisions

1. **Feature-based architecture** — Components grouped by feature (`shortener`, `analytics`) rather than type, improving maintainability and scalability.

2. **Centralized types** — Shared API types in `types/api.types.ts` ensure consistency between service layer and components.

3. **Service layer abstraction** — All API calls go through `url.service.ts`, making it easy to swap implementations or add interceptors.

4. **Co-located utilities** — Feature-specific utilities live within their feature folder (`features/*/utils/`), while shared utilities would go in a top-level `utils/` folder.

5. **Pragmatic component extraction** — Sub-components are only extracted when they improve readability or are reused. Small, tightly-coupled components stay in the parent file.
