# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Home Assistant Lovelace custom card for the Adaptive Climate integration. Built with Lit 3.x web components and TypeScript. Based on lovelace-mushroom by piitaya.

Features: temperature control, HVAC mode selection, adaptive condition badges (window/contact open, humidity pause, night setback, learning mode, away/vacation), color-coded circle (red=heating, blue=cooling).

## Commands

```bash
npm run start          # Dev server (watch + serve on port 4000)
npm run build          # Production build to dist/adaptive-climate-card.js
npm run format         # Prettier formatting

# Local HA testing (Docker)
npm run start:hass         # HA beta
npm run start:hass-stable  # HA stable
npm run start:hass-dev     # HA dev
```

No test suite exists. Releases are automated via semantic-release on push to main.

## Architecture

```
src/
├── mushroom.ts              # Entry point
├── cards/climate-card/      # Main card implementation
│   ├── climate-card.ts      # Card component
│   ├── climate-card-editor.ts
│   ├── climate-card-config.ts  # Config validation (superstruct)
│   ├── utils.ts             # Color/icon mappings, adaptive conditions
│   └── controls/            # Temperature/HVAC mode controls
├── ha/                      # Home Assistant abstraction layer
├── utils/                   # Base classes, styling, forms
│   ├── base-card.ts         # MushroomBaseCard base class
│   └── base-element.ts      # MushroomBaseElement base class
├── shared/                  # Reusable UI components (card, button, slider, badges)
└── translations/            # 33 language JSON files
```

Build outputs single bundle: `dist/adaptive-climate-card.js`

## Key Patterns

- **Lit decorators**: `@customElement`, `@state`, `@property` for reactive web components
- **Config validation**: superstruct schemas in `*-config.ts` files
- **Inheritance**: Cards extend `MushroomBaseCard` → `MushroomBaseElement`
- **CSS**: Lit `css\`\`` tagged templates
- **i18n**: Translation files in `src/translations/`, loaded via `localize.ts`

## Adaptive Climate Logic

Condition priority in `cards/climate-card/utils.ts`:
1. contact_open
2. open_window
3. humidity_spike
4. night_setback
5. learning_grace

Away/vacation modes detected via entity attributes.

## Build Notes

- Rollup bundles to ES format targeting ES2017
- Babel output plugin removed (was causing class name mangling)
- MWC components partially ignored to avoid duplication
- Special module context handling for formatjs (`this` → `window`)
