# Architecture

Bridge is organized around long-lived product boundaries rather than one-off screens.

## Principles

- `src/app` owns routes, metadata, and global styling.
- `src/components` owns reusable UI and feature-level presentation.
- `dataset` owns typed study records, canonical JSON files, and loader functions.
- `src/lib` owns shared constants, utility code, and application primitives.
- `public` owns browser-facing PWA assets.

## PWA Strategy

Bridge keeps the installable web app manifest, but service worker app-shell caching is disabled during active UI development. `public/sw.js` exists only as a cleanup script for browsers that previously installed the old worker. When offline study flows become stable, reintroduce caching with a build-aware strategy or a maintained PWA package.

## Theme Strategy

The accent system is CSS-variable based. `data-accent` is stored on the root document element, while Tailwind uses `rgb(var(--accent))` for components. Ocean is the default.

## Dataset Strategy

Local pages start as JSON records in `dataset/master84.json`. Each record represents exactly one study page. React components must load content through `dataset/loader.ts`, which keeps the data boundary ready for future datasets, validation, and storage-backed loaders.
