# AGENTS.md

## Commands

```bash
bun run dev          # start the Next.js development server
bun run lint         # run oxlint
bun run test         # run Bun regression tests
bun run fmt          # write formatting changes
bun run fmt --check  # check formatting without writing
bun run build        # production build and TypeScript validation
bun run analyze      # open the built-in Next.js bundle analyzer
```

Use Bun as the package manager and runtime. The Next.js scripts run with `bun --bun`. There is no separate typecheck command; TypeScript errors surface via `bun run build`.

## Maintenance Priorities

- Keep the archived blog readable, buildable, and straightforward to maintain.
- Prefer the smallest clear change that fixes a current problem. Do not add abstractions, infrastructure, configuration, or dependencies for hypothetical future work.
- Treat repository Markdown and local media as trusted build input. Preserve validation where data crosses an external boundary.
- Match verification to risk: run formatting and lint for routine edits; run a production build when routes, content parsing, Next.js configuration, or dependencies change.
- Preserve historical content and URLs unless a change explicitly requires a migration.

## Tech Stack

- Next.js 16 App Router with React 19
- Bun runtime and package manager; `bun.lock` is the lockfile
- Sass stylesheets and `@dsrca/design`
- Repository-backed Markdown rendered with `marked`
- Giscus comments, Google Analytics, Prism, Medium Zoom, and Sakana Widget

## Project Structure

```text
app/          # App Router pages, metadata, sitemap, and @toc parallel route
components/   # shared server and client components
contents/     # trusted Markdown source for the homepage and posts
public/       # post media and public static assets
assets/       # statically imported UI images
styles/       # global Sass variables and base styles
utils/        # Markdown, post-list, cache, and performance helpers
config.json   # site metadata, navigation links, and friend links
```

## Content and Routing

- `utils/assets.ts` reads Markdown from `contents/` and matching media from `public/`.
- Post URLs use `/post/[year]/[post]/`; all posts are returned by `generateStaticParams`.
- Paginated lists use `/post/page/[num]/`; page 1 is also exposed as `/post/`.
- Missing post content returns `null` from the content layer; route pages must call `notFound()` so the response keeps the custom UI and HTTP 404 status.
- `app/@toc` is a parallel route rendered by the root layout. Keep `app/@toc/default.tsx`; it is required for hard navigation and 404 recovery.
- `trailingSlash: true` is intentional. Preserve existing public URLs and the `/post/page/1/` redirect.

## Rendering Boundaries

- Components are Server Components unless they require browser APIs or React state.
- Keep browser-only integrations behind existing client boundaries such as Giscus, Prism, Medium Zoom, Search, and Sakana Widget.
- Route `params` are promises in Next.js 16 and must be awaited.
- Markdown is rendered with `dangerouslySetInnerHTML`. This is acceptable only while `contents/` remains trusted repository input; sanitize before accepting external or user-authored Markdown.

## Configuration and Conventions

- 2-space indentation and LF line endings.
- `@/` maps to the repository root.
- Use `oxfmt` for formatting and `oxlint` for linting.
- Keep the existing lint exceptions unless the corresponding native image and pagination patterns are removed.
- Keep site identity and author links in `config.json`; display the application version and license from `package.json` instead of duplicating those values.
- `.agents/` and `.codex/` are local skill artifacts and must remain ignored.
- `skills-lock.json` is tracked to keep project skill sources and versions reproducible.
- `docs/` contains local maintenance notes for this public repository and must remain ignored.

## Environment Variables

All current variables are public configuration:

- `NEXT_PUBLIC_GA_ID` is optional.
- These four Giscus variables are required as a complete set:
  - `NEXT_PUBLIC_GISCUS_REPO`
  - `NEXT_PUBLIC_GISCUS_REPO_ID`
  - `NEXT_PUBLIC_GISCUS_CATE`
  - `NEXT_PUBLIC_GISCUS_CATE_ID`
- `NEXT_PUBLIC_GISCUS_FRIENDS_TERM` is optional and only selects the friends-page discussion number.

Google Analytics renders only when `NEXT_PUBLIC_GA_ID` is present. Giscus renders only when all four required values are non-empty and the repository uses `owner/repo` format; keep runtime validation instead of asserting environment values into required third-party types.
