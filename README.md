# Zxilly Cangjie Index

A curated index of Zxilly's projects around the Cangjie programming language.

## Stack

- Vite
- React
- TypeScript
- Sass
- Vitest and Oxlint
- pnpm

## Development

```bash
pnpm install
pnpm dev
```

Run the full local quality gate before committing:

```bash
pnpm check
pnpm build
```

## Project structure

```text
src/
├── components/     Reusable UI components
├── data/           Project metadata and taxonomy
├── lib/            Catalog validation, grouping, and search
├── styles/         Sass modules grouped by responsibility
├── types/          Shared TypeScript types
├── App.tsx         Page composition and search state
└── main.tsx        Application entry point
```

Project metadata lives in [`src/data/projects.ts`](src/data/projects.ts). Every included
repository must belong to exactly one logical subgroup. The catalog builder validates this
invariant at startup, and the test suite protects it in CI.

Empty repositories and repositories used only to host static files, binaries, or release
artifacts are intentionally excluded.

## Live Stars

Star counts are never stored in the project catalog. The browser requests GitHub's public
repository API when the page loads and reuses each request while the page remains open. If
GitHub's API is unavailable or rate-limited, the card falls back to a live Shields badge.
GitCode-only repositories use GitCode's official live Star badge because its repository API
requires a private token that must not be exposed in frontend code. Projects mirrored across
multiple hosts use the primary GitHub repository count instead of adding mirror counts.

## Deployment

Pushes to `master` run [the Pages workflow](.github/workflows/deploy-pages.yml), which:

1. installs the locked pnpm dependencies;
2. runs type checking, linting, and tests;
3. builds the Vite application;
4. deploys `dist/` to GitHub Pages.

The production custom domain is `https://cj.zxilly.com`.
