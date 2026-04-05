# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check (tsc -b) then bundle (vite build) → dist/
npm run lint      # Run ESLint across the project
npm run preview   # Preview the production build locally
```

There is no test suite. Deploy via Firebase Hosting (`dist/` is the publish dir).

## Architecture

**Polardex** is a Pokemon card collection tracker. Stack: React 18 + TypeScript + Styled Components + Firebase Firestore.

### Data Flow

```
React Router v6 (/, /gallery, /studio)
  └── PolardexProviders (PageProvider + GalleryProvider)
        └── App (ThemeProvider + routes)
              └── Pages → Components → API hooks → Firebase Firestore
```

Firestore collections:
- `cards/data` — user's card collection (CardModel[])
- `pokemon/data` — Pokémon metadata
- `attributes/data` — card set attributes

### API Layer (`src/api/fetch/`)

Custom React hooks wrap Firestore queries directly — no intermediate service layer. Each hook reads from `doc(firestore, '<collection>', 'data')` and returns typed arrays. Example: `useGetCardsQuery()` fetches and sorts cards alphabetically by Pokémon name.

### State Management

Context-only — no Redux/Zustand. Two providers:
- `GalleryProvider` — gallery state (selected cards, filters)
- `PageProvider` — tracks current route/page

### Styling

Styled Components with a typed theme (`src/theme/theme.ts`). The `Theme` interface defines:
- `bgColor` (bg1–bg3, bgFooter)
- `textColor` (t1–t3 + hover variants)
- `miscColor` (f1–f4 feature accents, a1–a5 general accents)

Theme is available via `${({ theme }) => theme.bgColor.bg1}` in styled components. Type augmentation is in `src/styled-components.d.ts`.

### Studio Page (CRUD)

`/studio` is the card editor. Add/Modify/Attribute actions open `StudioModal`, which renders a split layout: form dialog (left) + live card canvas preview (right). Mutations go directly to Firestore via the Firebase SDK.

### TypeScript Config

Strict mode is on (`strict: true`, `noUnusedLocals`, `noUnusedParameters`). Target is ES2020, module resolution is `bundler`.
