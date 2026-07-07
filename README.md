# Bridge

처음 만나는 명심보감 암기 도우미.

Bridge is a mobile-first Next.js 15 PWA for studying and memorizing selected passages from the Myeongshim Bogam.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Installable PWA manifest with service worker caching disabled during active development
- ESLint and Prettier

## Getting Started

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Project Layout

```text
src/app        App Router routes, metadata, global styles
src/components Shared UI and feature components
dataset        Typed study records, JSON source, and loader
src/lib        Utilities and app constants
docs           Architecture and product notes
public         PWA manifest, service-worker cleanup script, icons
```

## Production Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```
