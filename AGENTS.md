# AGENTS.md

## Toolchain

Use Bun for installs, scripts, and tests. Commit `bun.lock`; do not add another package manager lockfile. The Next.js scripts use `bun --bun` to run under Bun.

```bash
bun install --frozen-lockfile
bun run dev
bun run fmt --check
bun run lint
bun run test
bun run build
```

Run formatting and lint for routine edits. Run a production build when changing routes, content parsing, Next.js configuration, or dependencies. The build also checks TypeScript.

## Project rules

- Keep this archived blog readable and maintainable. Prefer small changes and preserve historical content and public URLs.
- Content comes from trusted repository Markdown in `contents/`; media comes from `public/`. Keep filesystem and glob paths scoped to those directories. Sanitize Markdown if an external authoring source is introduced.
- Posts use `/post/[year]/[post]/`, and lists use `/post/page/[num]/`. Preserve `trailingSlash: true`, the `/post/page/1/` redirect, and `app/@toc/default.tsx` for hard navigation and 404 recovery.
- Missing post content must lead to `notFound()`. Await route `params` in Next.js 16.
- Keep components server rendered unless they need browser APIs or state. Load third-party scripts with `next/script`; rerun Prism after client-side navigation.
- Use an independent `Marked` instance per render because previews can render concurrently.
- Use native controls, accessible names for icon-only actions, and visible `:focus-visible` styles.
- Keep site identity in `config.json`; read version and license from `package.json`.
- Use 2-space indentation and LF line endings. `.agents/`, `.codex/`, and `docs/` stay ignored; `skills-lock.json` stays tracked.

Environment variables are documented in `README.md`. Project skills are not committed; on a fresh checkout, remind the user to install them from the commands in `README.md` before related UI or React/Next.js work.
