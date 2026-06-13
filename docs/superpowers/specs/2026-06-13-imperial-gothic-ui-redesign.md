# Imperial Gothic UI Redesign

**Date:** 2026-06-13
**Status:** Approved
**Scope:** Full UI visual overhaul of Kill Team Companion app

## Overview

Redesign the Kill Team Companion UI from its current modern sci-fi dark theme to an **Imperial Gothic** Warhammer 40K aesthetic. The design balances atmospheric theming with practical readability — medium-depth theming that adds gothic character without sacrificing usability.

## Design Decisions

### Style Direction

- **Theme:** Imperial Gothic (帝国哥特)
- **Depth:** Medium theming — gothic frames, ornamental elements, themed buttons, but practical layout preserved
- **Tone:** Forged in War (战争锻造) — dark steel gray, rust red, smoky black, worn metal feel
- **Brightness:** Leaning brighter for content readability — not overly dark

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Headings** | Pirata One | 400 | Panel titles, faction names, phase names, large numbers |
| **Body** | Outfit | 300–700 | Card content, descriptions, stats, labels (unchanged) |
| **Fallback** | System serif / sans-serif | — | CJK text falls back to system fonts naturally |

**Import:** Add `Pirata One` to the existing Google Fonts `<link>` in `index.html`.

### Color Palette

#### Base & Surface

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-color` | `#13151a` | Page background |
| `--panel-bg` | `#252830` | Primary panel surfaces |
| `--panel-bg-deep` | `#1a1d24` | Nested/inset surfaces |
| `--panel-bg-hover` | `#353840` | Hover/active states |
| `--panel-border` | `#5a5d65` | Primary borders (iron frame) |
| `--panel-border-outer` | `#3a3d45` | Double border outer ring |
| `--text-main` | `#e8e8e8` | Primary text |
| `--text-muted` | `#9a9da5` | Secondary text, labels |
| `--text-dim` | `#7a7d85` | Tertiary text, hints |

#### Accent & Decoration

| Token | Hex | Usage |
|-------|-----|-------|
| `--imperial-gold` | `#c9a84c` | Borders, ornaments, dividers |
| `--imperial-gold-bright` | `#e8d48b` | Heading text, important numbers |
| `--imperial-gold-glow` | `rgba(201,168,76,0.12)` | Ambient glow, etched lines |
| `--rust-red` | `#8b3a3a` | Danger, damage, warnings |
| `--rust-red-bright` | `#b84c4c` | Alert states |
| `--forge-green` | `#4a7c59` | Success, healing |
| `--forge-green-bright` | `#5b8c6a` | Positive states |

#### Faction Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--sm-blue` | `#4a6a9a` | Space Marine borders/accents |
| `--sm-glow` | `rgba(74,106,154,0.15)` | SM ambient glow |
| `--sm-accent` | `#6a9ad4` | SM text highlights |
| `--pm-green` | `#4a7c59` | Plague Marine borders/accents |
| `--pm-glow` | `rgba(74,124,89,0.12)` | PM ambient glow |
| `--pm-accent` | `#7ab88a` | PM text highlights |

#### Retained Utility

| Token | Hex | Usage |
|-------|-----|-------|
| `--red` | `#b84c4c` | Error toast, death overlay |
| `--green` | `#5b8c6a` | Success toast, confirm |
| `--gold` | `#c9a84c` | Generic gold (same as imperial-gold) |
| `--dark-card` | `#1a1d24` | Card backgrounds |

### Gothic Frame System

Every panel/card uses the gothic frame pattern with these layers:

1. **Double border** — `border: 2px solid var(--panel-border)` + `outline: 1px solid var(--panel-border-outer)` with `outline-offset: 3px`
2. **Texture background** — CSS repeating diagonal gradient overlay on panel surfaces:
   ```css
   background:
     repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.01) 3px, rgba(255,255,255,0.01) 6px),
     linear-gradient(180deg, var(--panel-bg), var(--panel-bg-deep));
   ```
3. **Gothic arch** — Top center decorative arch using CSS border-radius on a positioned element, with ✠ cross inside
4. **Corner ornaments** — `❧` (top corners) and `✦` (bottom corners) as Unicode decorations
5. **Etched inner frame** — Inner border using `rgba(201,168,76,0.12)` for depth
6. **Ambient glow** — Radial gradient from top center for sacred atmosphere

### Faction Banners

Each faction header uses a themed banner bar:
- Gradient background fading to transparent on edges
- Colored top border (2px) matching faction
- Radial glow in faction color
- Faction symbol ornaments (⚜ for SM, ☠ for PM) flanking the name
- Pirata One font for faction name

### Dividers

Three tiers of dividers:
- **Primary:** Gold line + ✠ cross center + ⬥ diamonds flanking — used between major sections
- **Secondary:** Simple gold gradient line — used within panels
- **Tertiary:** Iron gradient line — used for minor separations

### Buttons

- **Primary:** Metal gradient background + gold border + inset highlight + Pirata One uppercase text
- **Secondary:** Darker gradient + iron border + muted text
- **Danger:** Dark red gradient + rust border + light red text
- **Hover:** Slightly lighter gradient + subtle glow
- **Active:** Slightly darker gradient + inset shadow

### Body Background

Replace the current radial gradients with:
- Subtle diagonal metal texture via repeating-linear-gradient
- Very faint faction-colored ambient glows (reduced opacity)

## Implementation Scope

### Files Modified

1. **`src/styles/main.css`** — Primary file. Replace all color tokens, add gothic frame CSS, button styles, divider patterns, texture backgrounds, faction banner styles
2. **`index.html`** — Add Pirata One to Google Fonts import
3. **`src/js/ui.js`** — Update dynamically generated HTML to include gothic decorative elements (corner ornaments, divider markup, faction banner structure)
4. **`src/js/combat.js`** — Update combat modal HTML to use gothic frame patterns

### What Stays the Same

- All game logic, state management, combat calculations
- Layout structure (grid, flex, responsive breakpoints)
- All accessibility features (focus traps, ARIA roles, keyboard navigation, reduced motion, skip links, toast system)
- Touch target sizes (44×44px minimum)
- Font sizes (16px base, ≥0.75rem minimum)

### Performance Constraints

- All decorative elements are pure CSS (gradients, borders, pseudo-elements)
- No external images or SVG files required for decorations
- Unicode symbols for ornaments (no icon font needed)
- Texture overlay uses CSS repeating-gradient (negligible performance impact)
