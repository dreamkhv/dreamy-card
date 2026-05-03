# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # watch mode — Rollup rebuilds on change, serves on localhost:5000
npm run build      # one-off production build (minified)
npm run lint       # ESLint (src) + translation key validation
npm run lint:fix   # auto-fix ESLint issues
npm run format     # Prettier (whole repo)
npm test           # lint + build (no separate test suite)
```

> `npm start` outputs to `/Volumes/config/www/development` (mounted Home Assistant volume) — watch mode is typically already running in a separate terminal. Do not run `npm run build` manually while watch is active.

## Architecture

**dreamy-card** is a Home Assistant Lovelace custom card distributed as a single JS bundle (`dist/dreamy-card.js`). Built with Rollup + TypeScript + Lit.

### Data flow

```
Home Assistant → <dreamy-card> (DreamyCard)
                     │  reads config.mode
                     ├── 'state'    → <ds-state>    (sensor domain)
                     ├── 'stepper'  → <ds-stepper>  (input_number domain)
                     └── 'switcher' → <ds-switcher> (switch domain)
```

Each mode component extends `CardComponent` (`src/components/card-component.ts`), which is an abstract Lit base class. Subclasses implement `template(s: HomeAssistantService): Template`. The base class instantiates `HomeAssistantService` and guards against missing `hass`/`config`.

**`HomeAssistantService`** (`src/service.ts`) — thin wrapper over `hass.states[entity]` that exposes typed getters (`getState`, `getBooleanState`, `getNumberState`, `getLabel`, `getIcon`, `getUnit`, `getMin`, `getMax`, `getStep`). All HA state reads go through this class.

**`buildConfig`** (`src/config.ts`) — validates raw Lovelace YAML config, sets `mode` default to `'state'`, throws localised errors on missing `entity`.

**`modes`** (`src/modes.ts`) — registry of available modes with their allowed HA domains. Used by both the card and the visual editor (`src/editor.ts`) to populate the mode dropdown and filter entity selectors.

### Translations

`src/translations/en.json` is the source of truth. All other locale files must not contain keys absent from `en.json` — validated by `scripts/validate-i18n` (run as `lint:translations`). `localize(str)` uses `localStorage.selectedLanguage` → `navigator.language` → `'en'` fallback.

### CSS

Each component imports its own `.css` file from `src/css/`. PostCSS with `postcss-preset-env` (stage 1, nesting enabled) processes styles; `rollup-plugin-postcss-lit` injects them as Lit `CSSResult`.

### ESLint rules to be aware of

- `simple-import-sort` — imports must be sorted alphabetically
- `sort-keys-fix` — object literal keys must be sorted alphabetically (case-sensitive, natural order)
