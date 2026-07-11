# SaaS Analytics Dashboard

Modern administrative panel built as a **Frontend Developer (React / Next.js)** test assignment. The project follows production-oriented patterns: FSD architecture, typed API layer, responsive UI, i18n, and performance optimizations.

## Live Demo

> Deploy to [Vercel](https://vercel.com) and paste the URL here before submission.

```bash
npm run build && vercel --prod
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd sass-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start
```

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query + Axios |
| State | Zustand (persisted settings) |
| Forms | React Hook Form + Zod |
| Charts | Recharts (lazy-loaded) |
| Animations | Framer Motion + count-up stats |
| i18n | next-intl (EN / RU) |
| UI | Radix UI primitives |

## Features Checklist (TZ)

### Dashboard
- [x] 6 KPI cards with animated counters
- [x] Revenue, orders, countries, categories, top products charts
- [x] Recent users, products, orders with loading / empty / error states

### Users
- [x] Table: avatar, name, email, phone, company, country, status, actions
- [x] Search, sort, pagination, status filter
- [x] Multi-select, column visibility, CSV export

### Products
- [x] **Grid view** (TZ default): image, name, category, price, discount, rating, stock
- [x] Grid filters: search, category, price range, rating, sort, pagination
- [x] **List view** (admin table): category, stock/publish filters, price/rating filters, sort, export, columns

### Orders
- [x] Customer, product thumbnails, quantity, total, status
- [x] Search, sort, status tabs, pagination

### Analytics
- [x] Area, Bar, Pie, and pure **Line** charts
- [x] Revenue, orders, users growth, categories, countries, top products

### Settings
- [x] Theme: light / dark / system (navbar dropdown + settings page)
- [x] Language: EN / RU (navbar + settings)
- [x] Notification toggles
- [x] Profile section with **RHF + Zod** edit form

### UX & Quality
- [x] Skeleton, empty, error, retry on data views
- [x] 404, 500, global error, Error Boundary
- [x] Network error messages from API client
- [x] Command Palette (`Ctrl+K`) — pages + user/product search
- [x] Responsive layout (mobile / tablet / desktop)
- [x] Instant theme switch (no staggered color transition)
- [x] Accessibility: semantic HTML, ARIA, keyboard nav, focus-visible

## Project Structure (FSD)

```
src/
├── app/                      # Next.js routes, error pages
│   └── [locale]/             # Localized pages + loading.tsx
├── features/                 # Business features
│   ├── command-palette/
│   ├── orders-table/
│   ├── products-grid/        # TZ product catalog (grid)
│   ├── products-table/       # Admin list view
│   ├── products-view/        # Grid / List toggle
│   ├── profile-form/         # RHF + Zod profile editor
│   └── users-table/
├── widgets/                  # Composite UI blocks
│   ├── analytics/
│   ├── dashboard-charts/
│   ├── dashboard-layout/
│   ├── header/               # theme-menu, language-menu
│   ├── page-heading/
│   ├── recent-activity/
│   ├── settings/
│   ├── sidebar/
│   └── stats-cards/
└── shared/
    ├── api/                  # Axios services
    ├── config/               # Constants, query keys
    ├── hooks/                # useApiErrorMessage
    ├── i18n/                 # EN / RU messages
    ├── lib/                  # Utils, theme, apply-theme
    ├── providers/            # Query, Theme
    ├── stores/               # Zustand (settings, table prefs)
    ├── types/
    └── ui/                   # Design system components
```

## Architecture Decisions

### Feature-Sliced Design
- **shared/** — API, UI kit, hooks, stores
- **features/** — isolated domain UI (tables, forms, palette)
- **widgets/** — page sections composed from features
- **app/** — routing only

### Server vs Client State
- **TanStack Query** — remote data, caching (5 min stale), retry
- **Zustand + persist** — theme, locale, profile, notifications, table columns

### Performance
- `next/dynamic` for Recharts (code splitting)
- `next/image` with remote patterns (dummyjson, pravatar)
- `React.memo` on chart components
- `@tanstack/react-virtual` on users table (15+ rows)
- Theme applied synchronously via inline script + `useLayoutEffect`
- Client-side filter/sort after initial fetch (reduces API calls)

### Theme
- CSS variables on `:root` / `.dark`
- `color-scheme` for native controls
- `.disable-transitions` during theme switch for instant update

## API Sources

| Data | Endpoint |
|------|----------|
| Users | `https://dummyjson.com/users` |
| Products | `https://dummyjson.com/products` |
| Orders | `https://dummyjson.com/carts` |
| Countries | Static fallback (restcountries API deprecated) |

## Assumptions

1. **Order / user status** — derived from ID (API has no status field).
2. **Revenue by month** — distributed via `cart.id % 12` (no dates in API).
3. **Users growth** — simulated cumulative curve from total users.
4. **Low stock** — products with stock &lt; 20.
5. **Profile** — editable locally (no auth API); persisted in Zustand.
6. **Products page** — grid is default view per TZ; list view is extra admin UX with full filters.

## Bonus Features Implemented

- Command Palette with entity search
- i18n (EN / RU)
- Persisted user settings & table preferences
- Animated stat counters (count-up)
- Framer Motion card entrance
- Breadcrumbs on all main pages
- Per-route `loading.tsx` skeletons
- Command palette search loading state
- Navbar theme & language dropdowns

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `table`)
- ARIA labels on controls and dialogs
- `:focus-visible` outlines for keyboard navigation (mouse clicks keep clean UI)
- `prefers-reduced-motion` respected

## License

MIT
