# AGENTS.md — sanstream (Suitch)

Guidance for agentic coding tools operating in this repository.

---

## Project Overview

Single-package **Astro 5 SSR** project deployed on **Netlify**. React 19 is used
for interactive islands. Auth is handled via `auth-astro` with a Twitch OAuth
provider. No monorepo — one `package.json` at the root.

---

## Commands

Use **pnpm** for every package operation.

```bash
pnpm dev          # Start dev server (astro dev)
pnpm build        # Production build (astro build)
pnpm preview      # Preview production build locally (astro preview)
pnpm astro <cmd>  # Direct access to the Astro CLI
```

### Testing & Linting

**No test framework is configured.** No `lint` script exists either.

Before shipping changes:
- Run `pnpm build` to catch type errors and build failures.
- If Vitest is added in the future, run a single test with:
  `pnpm vitest run -t "<test name>"` or `pnpm vitest run <file>`
- If ESLint is added, run with: `pnpm lint`

---

## Stack

| Layer         | Technology                                    |
|---------------|-----------------------------------------------|
| Framework     | Astro 5 (`output: 'server'`, SSR)             |
| UI Islands    | React 19 (`@astrojs/react`)                   |
| Styling       | Tailwind CSS 3 (`@astrojs/tailwind`)          |
| Auth          | `auth-astro` + `@auth/core` (Twitch OAuth)    |
| Deployment    | Netlify (`@astrojs/netlify` adapter)          |
| Package mgr   | pnpm                                          |

---

## TypeScript

- `tsconfig.json` extends `astro/tsconfigs/strict` — strict mode is required.
- JSX is compiled with `react-jsx` / `jsxImportSource: "react"`.
- Source files are currently `.jsx`/`.js`; **prefer `.tsx`/`.ts` for new files**.
- Avoid `any` and `unknown`; let TypeScript infer types wherever possible.
- If types are unclear, stop and clarify before proceeding.

---

## File Naming & Structure

```
src/
  assets/       # SVGs and static assets
  components/   # React (.tsx) and Astro (.astro) components
  hooks/        # React custom hooks (useXxx.ts)
  layouts/      # Astro layout files
  logic/        # Business/data-orchestration logic
  pages/        # Astro pages (file-based routing)
  services/     # API abstraction layer
```

- React components: `PascalCase.tsx` (e.g., `LiveChannels.tsx`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g., `useStream.ts`)
- Services / logic: `camelCase.ts`
- Astro pages and layouts: match filename to route or role
- Note: several existing filenames contain typos (`AppWraper`, `SanstreamLyout`).
  Do not perpetuate them in new files.

---

## Imports

- **No path aliases are configured** (`@/`, `~/`, etc. are not set up).
- Use **relative paths** for all imports.
- Do **not** create barrel files (`index.ts`); import each module directly.
- Astro public env vars: `import.meta.env.PUBLIC_*`
- Private server-side env vars (Node scripts only): `process.env.*`

---

## Component Style

### Astro components
- Use `---` frontmatter for server logic and imports.
- Pass data to React islands via props; avoid global mutable state at the module level.
- Hydration directives: prefer `client:visible` for below-fold islands,
  `client:only="react"` when the component must never SSR.

### React components
- Named exports only — no default exports from component files.
- Use `useState` + `useEffect` for local async data; encapsulate in custom hooks.
- SSR-safety guard pattern when accessing browser APIs:
  ```tsx
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  ```
- Debounce user-input effects (300 ms) before triggering API calls.

---

## Styling

- Tailwind utility classes are the **only** styling solution — no CSS files, no
  CSS-in-JS, no inline `style` props.
- Do not duplicate class strings; extract a component instead.
- Conditional classes via template literals or ternaries (no `clsx` installed):
  ```tsx
  className={`base-class ${condition ? 'active' : 'inactive'}`}
  ```
- Custom theme tokens (defined in `tailwind.config.mjs`):
  - `rose`: `#ec4899`
  - `primary`: `#161616`
  - `secondary`: `#1C1C1C`
- Accessibility is mandatory: use semantic HTML, ARIA roles where needed,
  and manage focus for interactive components.

---

## Icons

- Use **`@tabler/icons-react`** for icons (install if not yet present).
- Import each icon **explicitly** — never import from a barrel:
  ```tsx
  // correct
  import { IconSearch } from '@tabler/icons-react/dist/esm/icons/IconSearch'
  // also acceptable (named import from main package)
  import { IconSearch } from '@tabler/icons-react'
  ```
- Do **not** inline SVG paths manually for icons that exist in tabler-icons.

---

## Error Handling

Services must return a `{ data, error }` shape — never throw from the service layer:

```ts
const handleAPIError = (error: unknown, context = '') => {
  console.error(`Error en ${context}:`, error);
  return { data: [], error: error instanceof Error ? error.message : String(error) };
};
```

- Wrap all `fetch` calls in `try/catch` and delegate to `handleAPIError`.
- Log errors to `console.error` with context; do not silently swallow them.
- Parallel fetches use `Promise.all()` so a single failure can be isolated.

---

## Code Comments & Language

- **Comments are written in Spanish** — follow this convention for inline comments.
- Commit messages and PR titles may be in English or Spanish; be consistent within a PR.

---

## API & Auth

- All Twitch API calls go through `src/services/apiTwitch.ts` — do not call the
  Twitch API directly from components or pages.
- Data orchestration (composing multiple API calls) lives in `src/logic/`.
- Auth session is managed by `auth-astro`; read the session in `.astro` files via
  `getSession(Astro.request)` and pass the token down as a prop.
- Never expose `TWITCH_CLIENT_SECRET` or any server-only secret to the client.
- Public values that must reach the browser are prefixed `PUBLIC_` in `.env`.

---

## Performance & Decisions

- Measure before optimising; do not guess bundle size or render performance.
- Instrument first (`console.time`, Lighthouse, Astro's build output) then act.
- Validate changes in a small scope before propagating them across the codebase.

---

## Commits & PRs

- Run `pnpm build` (and `pnpm lint` / `pnpm test` if configured) before committing.
- PR title format: `[sanstream] Clear, concise description`
- PRs should be small and focused on a single concern.
- Explain what changed, why, and how it was verified in the PR body.
- Never commit `.env` files or secrets.

---

## Agent Behaviour

- Unclear requests: ask concrete questions before acting.
- Simple, well-defined tasks: execute directly.
- Complex changes (refactors, new features, architecture decisions): confirm
  understanding before acting.
- Do not assume implicit requirements — ask if information is missing.
