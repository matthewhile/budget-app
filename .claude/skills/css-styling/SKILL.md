---
name: css-styling
description: Guidance for CSS and styling work on BudgetApp25's React frontend — the design-token system in index.css, the light/dark theming setup, and Bootstrap CSS-variable gotchas discovered while building it. Use whenever writing or changing CSS, adjusting colors/spacing/radius/shadows, styling a new component, adding dark-mode support to something, or debugging a style that "looks right in the code but isn't actually applying."
---

# CSS / styling on BudgetApp25's frontend

The frontend is React 19 + Vite, using **React-Bootstrap** components (not custom-built ones) styled via **Bootstrap 5.3's CSS custom-property system**, plus a small hand-rolled dark mode. There is no Sass build, no CSS-in-JS, no Tailwind — everything is plain CSS files loaded as global stylesheets.

## File map

- `frontend/src/index.css` — the design-token system and all Bootstrap variable overrides. This is where nearly all styling work happens. See below.
- `frontend/src/styles/Dashboard.css`, `frontend/src/styles/Login.css` — small amounts of page-specific plain CSS (layout, one-off classes like `.editBudgetBtn`, `.login-box`).
- `frontend/src/components/ThemeToggle.jsx` + `frontend/src/hooks/useTheme.js` — the light/dark toggle UI and its state (`localStorage` + `data-theme` attribute on `<html>`). Only mounted in `Dashboard.jsx`, not on the login page.
- `frontend/src/main.jsx` — import order matters here: `bootstrap.min.css` loads, then `index.css`. Never reorder this — `index.css`'s overrides depend on loading after Bootstrap's defaults.

## The token system in index.css

Three layers, in this order in the file:

1. **Design tokens** (`--color-*`, `--radius-*`, `--shadow-*`, `--font-sans`) — the actual palette. Defined **three times**:
   - Once in the base `:root` block (light mode / default).
   - Once inside `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }` — for users who never touch the toggle, so it still follows the OS setting.
   - Once inside `:root[data-theme="dark"] { ... }` — set by the toggle, and wins over the OS setting in either direction.

   **When adding or changing a token, you almost always need to touch all three blocks**, or dark mode (or light mode, if you forget the override) will silently keep the wrong value. If a token should just always equal another token regardless of theme (e.g. `--color-border-strong` in dark mode), reference it with `var(--color-border)` in that block rather than hardcoding — it's less to keep in sync later.

2. **Bootstrap variable mapping** (`--bs-*`) — a `:root` block that points Bootstrap's own root-level tokens (`--bs-primary`, `--bs-body-bg`, `--bs-border-color`, `--bs-link-color`, etc.) at the `--color-*` tokens above. This is what re-themes most of Bootstrap for free.

3. **Component overrides** — `.btn-primary`, `.card`, `.modal-content`, `.dropdown-menu`, `.table`, `.progress`, `.table-success`, etc. These exist because of the gotcha below — plain `:root` mapping isn't always enough.

## Gotcha #1: Bootstrap shadows root-level variables inside its own components

Bootstrap's *compiled* CSS doesn't just read `--bs-card-bg` etc. from `:root` — several components **locally redeclare** their own background/border variable, pointing it at `var(--bs-body-bg)` (or similar), directly on their own selector:

```css
/* inside bootstrap.min.css */
.card { --bs-card-bg: var(--bs-body-bg); ... }
.modal-content { --bs-modal-bg: var(--bs-body-bg); ... }
.dropdown-menu { --bs-dropdown-bg: var(--bs-body-bg); ... }
.table { --bs-table-bg: var(--bs-body-bg); ... }
```

Because this redeclaration happens **on the element itself**, it wins over anything set at `:root`, no matter how you set it — a `:root` override for `--bs-card-bg` is simply shadowed and does nothing. This bit us more than once while theming: cards, modals, dropdowns, and the expense table all silently kept rendering as the plain page background instead of their intended surface color, for weeks of work, before it was caught by comparing computed styles.

**The fix**: redeclare the variable directly on the same selector Bootstrap uses, in `index.css`, after the Bootstrap import:

```css
.card {
  --bs-card-bg: var(--color-card-bg);
  --bs-card-border-color: var(--color-border-strong);
}
.modal-content {
  --bs-modal-bg: var(--color-surface);
  --bs-modal-border-color: var(--color-border);
}
```

**Before assuming a `:root`-level override will work for a new component**, check whether Bootstrap's compiled CSS locally redeclares that variable on the component's own selector:

```bash
node -e "
const fs = require('fs');
const c = fs.readFileSync('frontend/node_modules/bootstrap/dist/css/bootstrap.min.css', 'utf8');
const idx = c.indexOf('--bs-SOMETHING-you-are-checking');
console.log(c.slice(idx - 60, idx + 5));
"
```
If the text just before it is a selector (`.some-class{--bs-...`), it's local — override it there, not at `:root`. If it's a plain reference like `--bs-progress-bg:var(--bs-secondary-bg)` on `.progress`, that's usually still safe to fix by overriding the *referenced* token (`--bs-secondary-bg`) at `:root`, unless that token is also used somewhere you don't want to touch (see the `.progress` override in the file for why we scoped that one directly instead).

## Gotcha #2: Bootstrap's own dark theme is unreachable — don't rely on it

Bootstrap 5.3 ships a real dark theme, but it only activates under the `[data-bs-theme="dark"]` attribute. **This app never sets that attribute** — our dark mode uses its own `[data-theme="dark"]` attribute (no `bs-` prefix) plus a `prefers-color-scheme` media query, set up independently in `index.css` and `useTheme.js`.

This means any Bootstrap **semantic color token** that only ships a dark variant behind `[data-bs-theme="dark"]` — `--bs-emphasis-color`, `--bs-secondary-color`, `--bs-*-bg-subtle`, `--bs-*-border-subtle`, `--bs-*-text-emphasis`, etc. — is **permanently stuck at its light value** in this app unless explicitly remapped. This produced real bugs, not just cosmetic ones: `--bs-emphasis-color` (the default `<table>` text color) stayed pure black in dark mode, making expense-table rows unreadable, and `Alert variant="danger"` stayed pale pink everywhere.

**Whenever you introduce or restyle a Bootstrap component/utility class for the first time, check whether it uses one of these "subtle"/"emphasis" semantic tokens**, and if so add a dark-mode override (see the `--bs-danger-bg-subtle` / `--bs-emphasis-color` overrides in `index.css` for the pattern — composed from `--color-danger`/`--color-text` with `rgba(var(--color-*-rgb), alpha)` for the subtle variants).

```bash
# find which selectors reference a given Bootstrap semantic token
grep -o '[a-zA-Z0-9_-]*{[^}]*--bs-danger-bg-subtle[^}]*}' frontend/node_modules/bootstrap/dist/css/bootstrap.min.css
```

## React-Bootstrap specifics

- `className` passed to a React-Bootstrap component doesn't always land where you'd expect. E.g. `<ProgressBar className="rounded-pill" ...>` puts `rounded-pill` on the **outer track wrapper** (`.progress`), not the inner filled bar (`.progress-bar`) — check the component's source in `node_modules/react-bootstrap/cjs/*.js` if a class isn't behaving as expected, rather than guessing from the JSX alone.
- Utility classes like `bg-light`, `bg-danger bg-opacity-10`, `text-muted` read root-level Bootstrap tokens directly (`--bs-light`, `--bs-danger-rgb`, `--bs-secondary-color`) and are **not** subject to the component-shadowing gotcha above — only actual Bootstrap *components* (Card, Modal, Dropdown, Table, Progress, Button, etc.) redeclare their variables locally.

## Verifying a styling change

Screenshots alone can be misleading (colors that are "close enough" visually can still be the wrong token, especially dark-on-dark). After any styling change:

1. `npm run build` in `frontend/` — confirms no CSS/JSX errors.
2. Check live in the browser in **both** themes — the dev server is usually already running; use the in-app theme toggle (top-left of the dashboard) to flip modes, or check `window.matchMedia('(prefers-color-scheme: dark)').matches` first to know which mode you're starting from.
3. Confirm with `getComputedStyle(el).backgroundColor` / `.color` / `.borderColor` in the browser console (or via `javascript_tool`), not just a visual read of a screenshot — this is how the shadowing bugs above were actually caught.
4. If you changed a dark-mode-gated block, clear any test override afterward: `localStorage.removeItem('theme')` — otherwise you leave the browser pinned to whichever mode you were testing.
5. If you temporarily force `@media (prefers-color-scheme: dark)` to `@media screen` to preview dark mode without changing OS settings, **revert it** before finishing — don't leave the file in that state.

## Known constraints from CLAUDE.md

Backend/API and data-layer conventions live in the top-level `CLAUDE.md` — not relevant here except: the frontend dev server runs on `http://localhost:5173` (`npm run dev` from `frontend/`), and `npm run build` / `npm run lint` are the other relevant scripts.
