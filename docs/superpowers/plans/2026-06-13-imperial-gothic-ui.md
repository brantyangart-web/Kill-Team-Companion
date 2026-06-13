# Imperial Gothic UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Kill Team Companion UI from modern sci-fi dark theme to Imperial Gothic Warhammer 40K aesthetic.

**Architecture:** CSS-first visual overhaul using custom properties for all colors, pure CSS gothic frame system (textures, borders, ornaments), and JS updates to inject decorative markup into dynamically generated panels. No external images — all effects via gradients, borders, and Unicode symbols.

**Tech Stack:** CSS Custom Properties, CSS Gradients, Google Fonts (Pirata One + Outfit), vanilla JS DOM manipulation

**Spec:** `docs/superpowers/specs/2026-06-13-imperial-gothic-ui-redesign.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `index.html` | Modify | Google Fonts import, inline font references |
| `src/styles/main.css` | Modify | All color tokens, gothic frame CSS, button styles, dividers, faction banners, texture overlays |
| `src/js/ui.js` | Modify | Dynamic HTML for roster pickers, operative cards, phase overlays, score panels — add gothic ornaments |
| `src/js/combat.js` | Modify | Dynamic HTML for combat modals, duel headers — add gothic ornaments |

---

### Task 1: Google Fonts & Font Token Replacement

**Files:**
- Modify: `index.html:10`
- Modify: `src/styles/main.css` (all `Orbitron` references)
- Modify: `src/js/ui.js` (4 inline `Orbitron` references)
- Modify: `src/js/combat.js` (13 inline `Orbitron` references)
- Modify: `index.html` (2 inline `Orbitron` references)

- [ ] **Step 1: Add Pirata One to Google Fonts import**

In `index.html` line 10, replace:
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```
With:
```html
<link href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Note: We remove Orbitron entirely and replace with Pirata One. Pirata One only has weight 400, so no weight variants needed.

- [ ] **Step 2: Replace all Orbitron references in main.css**

In `src/styles/main.css`, perform a global find-and-replace:
- Find: `'Orbitron', sans-serif`
- Replace with: `'Pirata One', serif`

This affects approximately 25 locations across the CSS file. Every `font-family: 'Orbitron', sans-serif` becomes `font-family: 'Pirata One', serif`.

Also remove any `font-weight` values of `600`, `700`, `900` on Pirata One rules (Pirata One only has 400 weight). Keep the property but set to `400` or remove the line if it's standalone. For rules where font-weight is combined with other properties on one line, just change the weight value.

Key CSS rules to update:
- `.tp-num` (line ~91): change `font-weight: 900` → `font-weight: 400`
- `.phase-badge` (line ~106): change `font-weight: 700` → `font-weight: 400`
- `.combat-action-btn .cost` (line ~597): keep as-is, Pirata One renders fine at small sizes
- `.modal-title` (line ~636): change `font-weight: bold` → `font-weight: 400`
- `.ploy-title` (line ~680): change `font-weight: bold` → `font-weight: 400`

For all other Orbitron→Pirata One replacements, the `font-weight` can remain since CSS will just use 400 anyway.

- [ ] **Step 3: Replace inline Orbitron references in index.html**

In `index.html`, replace 2 occurrences:
- Line ~101: `font-family: 'Orbitron', sans-serif` → `font-family: 'Pirata One', serif`
- Line ~270: `font-family: 'Orbitron', sans-serif` → `font-family: 'Pirata One', serif`

- [ ] **Step 4: Replace inline Orbitron references in ui.js**

In `src/js/ui.js`, replace 4 occurrences of `font-family:'Orbitron',sans-serif` with `font-family:'Pirata One',serif`:
- Line ~508: SM roster count
- Line ~551: PM roster count
- Line ~1431: SM scoring header
- Line ~1481: PM scoring header

- [ ] **Step 5: Replace inline Orbitron references in combat.js**

In `src/js/combat.js`, replace all 13 occurrences of `font-family:'Orbitron',sans-serif` with `font-family:'Pirata One',serif`. These are in:
- Line ~1230: melee choice card dice value
- Lines ~1546, 1551, 1555, 1561, 1566: melee duel header
- Lines ~1585, 1590, 1594, 1600, 1605: shoot duel header

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "style: replace Orbitron font with Pirata One for gothic aesthetic"
```

---

### Task 2: Color Token Overhaul

**Files:**
- Modify: `src/styles/main.css:1-21`

- [ ] **Step 1: Replace all CSS custom properties in :root**

In `src/styles/main.css`, replace the entire `:root` block (lines 1–21) with:

```css
:root {
  /* Base & Surface */
  --bg-color: #13151a;
  --panel-bg: rgba(37, 40, 48, 0.92);
  --panel-bg-deep: #1a1d24;
  --panel-bg-hover: #353840;
  --panel-border: #5a5d65;
  --panel-border-outer: #3a3d45;
  --text-main: #e8e8e8;
  --text-muted: #9a9da5;
  --text-dim: #7a7d85;

  /* Accent & Decoration */
  --imperial-gold: #c9a84c;
  --imperial-gold-bright: #e8d48b;
  --imperial-gold-glow: rgba(201, 168, 76, 0.12);
  --rust-red: #8b3a3a;
  --rust-red-bright: #b84c4c;
  --forge-green: #4a7c59;
  --forge-green-bright: #5b8c6a;

  /* Faction: Space Marine */
  --sm-blue: #4a6a9a;
  --sm-glow: rgba(74, 106, 154, 0.15);
  --sm-accent: #6a9ad4;

  /* Faction: Plague Marine */
  --pm-green: #4a7c59;
  --pm-glow: rgba(74, 124, 89, 0.12);
  --pm-accent: #7ab88a;

  /* Utility (backward compat aliases) */
  --gold: #c9a84c;
  --gold-glow: rgba(201, 168, 76, 0.15);
  --red: #b84c4c;
  --green: #5b8c6a;
  --dark-card: #1a1d24;
}
```

- [ ] **Step 2: Update hardcoded color references in CSS**

Search and replace these hardcoded colors throughout `src/styles/main.css`:

| Find | Replace | Context |
|------|---------|---------|
| `#1e293b` | `#252830` | Old panel gradient stops |
| `#0f172a` | `#1a1d24` | Old deep backgrounds |
| `#030712` | `#13151a` | Old bg (already in :root) |
| `#080c14` | `#1a1d24` | Old dark-card (already in :root) |
| `rgba(217, 119, 6,` | `rgba(201, 168, 76,` | Old gold/amber → imperial gold |
| `#d97706` | `#c9a84c` | Old gold solid → imperial gold |
| `#eab308` | `#e8d48b` | Old bright yellow → bright gold |
| `rgba(29, 78, 216,` | `rgba(74, 106, 154,` | Old SM blue glow |
| `#1d4ed8` | `#4a6a9a` | Old SM blue solid |
| `rgba(59, 130, 246,` | `rgba(74, 106, 154,` | Old SM blue glow |
| `#60a5fa` | `#6a9ad4` | Old SM accent |
| `#93c5fd` | `#8ab4e0` | Old SM light text |
| `rgba(21, 128, 61,` | `rgba(74, 124, 89,` | Old PM green glow |
| `#15803d` | `#4a7c59` | Old PM green solid |
| `rgba(34, 197, 94,` | `rgba(74, 124, 89,` | Old PM green glow |
| `#a3e635` | `#7ab88a` | Old PM accent (bright lime) |
| `#22c55e` | `#5b8c6a` | Old green accent |
| `rgba(74, 222, 128,` | `rgba(74, 124, 89,` | Old PM light glow |
| `#4ade80` | `#7ab88a` | Old PM bright |
| `#a7f3d0` | `#b0d4ba` | Old PM light text |
| `#e11d48` | `#b84c4c` | Old red (already via var) |
| `#f43f5e` | `#b84c4c` | Old red accent |
| `#ef4444` | `#b84c4c` | Old red variant |
| `#10b981` | `#5b8c6a` | Old green (already via var) |
| `#059669` | `#4a7c59` | Old green dark |
| `#0284c7` | `#4a6a9a` | Old blue accent |
| `#075985` | `#3a5580` | Old blue dark |
| `#0ea5e9` | `#6a9ad4` | Old bright blue |
| `rgba(239, 68, 68,` | `rgba(184, 76, 76,` | Old red glow |
| `rgba(14, 165, 233,` | `rgba(74, 106, 154,` | Old blue glow |
| `rgba(244, 63, 94,` | `rgba(184, 76, 76,` | Old red glow variant |
| `#991b1b` | `#5a2020` | Old deep red |

- [ ] **Step 3: Update hardcoded colors in ui.js inline styles**

In `src/js/ui.js`, find and replace hardcoded colors in inline style strings:
- `#60a5fa` → `#6a9ad4`
- `rgba(59,130,246` → `rgba(74,106,154`
- `rgba(34,197,94` → `rgba(74,124,89`
- `#94a3b8` → `#9a9da5`
- `#eab308` → `#e8d48b`
- `#1d4ed8` → `#4a6a9a`

- [ ] **Step 4: Update hardcoded colors in combat.js inline styles**

In `src/js/combat.js`, find and replace:
- `#60a5fa` → `#6a9ad4`
- `rgba(59,130,246` → `rgba(74,106,154`
- `rgba(34,197,94` → `rgba(74,124,89`
- `#ef4444` → `#b84c4c`
- `#991b1b` → `#5a2020`
- `#0284c7` → `#4a6a9a`
- `#075985` → `#3a5580`
- `#0ea5e9` → `#6a9ad4`
- `rgba(239, 68, 68,` → `rgba(184, 76, 76,`
- `rgba(14, 165, 233,` → `rgba(74, 106, 154,`
- `rgba(244, 63, 94,` → `rgba(184, 76, 76,`

- [ ] **Step 5: Update hardcoded colors in index.html inline styles**

In `index.html`, update:
- Line ~82: `background: var(--green); border-color: #059669` → `background: var(--green); border-color: #4a7c59`

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "style: replace color palette with Imperial Gothic forged-in-war tones"
```

---

### Task 3: Body Background & Panel Base Styles

**Files:**
- Modify: `src/styles/main.css:29-42` (body), `src/styles/main.css:54-67` (global-dash)

- [ ] **Step 1: Update body background with metal texture**

In `src/styles/main.css`, replace the `body` rule (lines ~29-42) with:

```css
body {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  background-color: var(--bg-color);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 6px),
    radial-gradient(at 0% 0%, rgba(74, 106, 154, 0.06) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(74, 124, 89, 0.05) 0px, transparent 50%);
}
```

- [ ] **Step 2: Update .global-dash with gothic double border**

In `src/styles/main.css`, replace the `.global-dash` rule (lines ~55-67) with:

```css
.global-dash {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;
  background:
    repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 6px),
    linear-gradient(180deg, var(--panel-bg), var(--panel-bg-deep));
  border: 2px solid var(--panel-border);
  outline: 1px solid var(--panel-border-outer);
  outline-offset: 3px;
  border-radius: 6px;
  padding: 16px 24px;
  margin-bottom: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.5), inset 0 0 40px rgba(201,168,76,0.02);
  position: relative;
}
```

- [ ] **Step 3: Update .tp-box (turning point box)**

Replace the `.tp-box` rule with:

```css
.tp-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #252830, #1a1d24);
  border: 2px solid var(--imperial-gold);
  box-shadow: 0 0 15px var(--gold-glow), inset 0 1px 0 rgba(255,255,255,0.05);
  padding: 8px 16px;
  border-radius: 4px;
  min-width: 120px;
}
```

- [ ] **Step 4: Update .tp-num and .phase-badge colors**

Replace `.tp-num` with:
```css
.tp-num {
  font-family: 'Pirata One', serif;
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--imperial-gold-bright);
  line-height: 1.2;
  text-shadow: 0 0 15px rgba(201,168,76,0.25);
}
```

Replace `.phase-badge` with:
```css
.phase-badge {
  font-family: 'Pirata One', serif;
  font-size: 0.8rem;
  font-weight: 400;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid var(--imperial-gold);
  color: var(--imperial-gold-bright);
  padding: 3px 10px;
  border-radius: 3px;
  margin-top: 4px;
  text-transform: uppercase;
}
```

- [ ] **Step 5: Update .score-card with gothic styling**

Find the `.score-card` rule and replace with:

```css
.score-card {
  background: var(--panel-bg-deep);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  padding: 10px 16px;
  min-width: 180px;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
}
.score-card::before {
  content: '';
  position: absolute;
  top: 4px; left: 4px; right: 4px; bottom: 4px;
  border: 1px solid var(--imperial-gold-glow);
  border-radius: 2px;
  pointer-events: none;
}
.score-card.sm {
  border-color: var(--sm-blue);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.2), 0 0 10px var(--sm-glow);
}
.score-card.pm {
  border-color: var(--pm-green);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.2), 0 0 10px var(--pm-glow);
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "style: apply gothic double-border and texture to panels"
```

---

### Task 4: Gothic Frame CSS Utility Classes

**Files:**
- Modify: `src/styles/main.css` (append new section)

- [ ] **Step 1: Add gothic frame utility CSS**

Append the following CSS section at the end of `src/styles/main.css` (before the existing accessibility section):

```css
/* ==========================================
   Gothic Frame System
   ========================================== */

/* Base gothic panel */
.gothic-panel {
  background:
    repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 6px),
    linear-gradient(180deg, var(--panel-bg), var(--panel-bg-deep));
  border: 2px solid var(--panel-border);
  outline: 1px solid var(--panel-border-outer);
  outline-offset: 3px;
  border-radius: 6px;
  position: relative;
  box-shadow: 0 6px 24px rgba(0,0,0,0.5), inset 0 0 40px rgba(201,168,76,0.02);
}

/* Etched inner frame */
.gothic-panel::before {
  content: '';
  position: absolute;
  top: 6px; left: 6px; right: 6px; bottom: 6px;
  border: 1px solid var(--imperial-gold-glow);
  border-radius: 3px;
  pointer-events: none;
  z-index: 0;
}

/* Gothic arch decoration at top center */
.gothic-arch {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 24px;
  background: var(--panel-bg);
  border: 2px solid var(--panel-border);
  border-bottom: none;
  border-radius: 30px 30px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.gothic-arch::after {
  content: '✠';
  color: var(--imperial-gold);
  font-size: 10px;
  margin-top: 4px;
}

/* Corner ornaments */
.gothic-corners::after {
  content: '❧';
  position: absolute;
  top: 8px;
  left: 10px;
  color: var(--imperial-gold);
  font-size: 14px;
  opacity: 0.6;
  pointer-events: none;
  z-index: 1;
}

/* Gold divider with cross and diamonds */
.gothic-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0;
}
.gothic-divider::before,
.gothic-divider::after {
  content: '';
  flex: 1;
  height: 1px;
}
.gothic-divider::before {
  background: linear-gradient(90deg, transparent, var(--panel-border));
}
.gothic-divider::after {
  background: linear-gradient(270deg, transparent, var(--panel-border));
}

/* Simple gold line divider */
.gothic-divider-gold {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--imperial-gold), transparent);
  margin: 12px 0;
}

/* Iron line divider (secondary) */
.gothic-divider-iron {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--panel-border), transparent);
  margin: 10px 0;
}

/* Faction banners */
.faction-banner {
  position: relative;
  padding: 10px 20px;
  overflow: hidden;
}
.faction-banner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
}
.faction-banner.sm {
  background: linear-gradient(90deg, transparent 0%, #1a2a45 15%, #1e3050 50%, #1a2a45 85%, transparent 100%);
  border-top: 2px solid var(--sm-blue);
  border-bottom: 1px solid rgba(74, 106, 154, 0.3);
}
.faction-banner.sm::before {
  background: radial-gradient(ellipse at 50% 0%, var(--sm-glow), transparent 60%);
}
.faction-banner.pm {
  background: linear-gradient(90deg, transparent 0%, #1a2d20 15%, #1e3525 50%, #1a2d20 85%, transparent 100%);
  border-top: 2px solid var(--pm-green);
  border-bottom: 1px solid rgba(74, 124, 89, 0.3);
}
.faction-banner.pm::before {
  background: radial-gradient(ellipse at 50% 0%, var(--pm-glow), transparent 60%);
}

/* Gothic button base */
.btn-gothic {
  font-family: 'Pirata One', serif;
  padding: 12px 24px;
  background: linear-gradient(180deg, #3a3d45 0%, #2a2d35 100%);
  border: 2px solid var(--imperial-gold);
  border-radius: 4px;
  color: var(--imperial-gold-bright);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
  transition: all 0.2s ease;
  min-height: 44px;
}
.btn-gothic:hover {
  background: linear-gradient(180deg, #454850 0%, #353840 100%);
  box-shadow: 0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 15px var(--gold-glow);
}
.btn-gothic:active {
  background: linear-gradient(180deg, #2a2d35 0%, #1e2128 100%);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
.btn-gothic:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Secondary gothic button */
.btn-gothic-secondary {
  font-family: 'Pirata One', serif;
  padding: 12px 24px;
  background: linear-gradient(180deg, #2a2d35 0%, #1e2128 100%);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  min-height: 44px;
}
.btn-gothic-secondary:hover {
  border-color: var(--imperial-gold);
  color: var(--imperial-gold-bright);
}

/* Danger gothic button */
.btn-gothic-danger {
  font-family: 'Pirata One', serif;
  padding: 12px 24px;
  background: linear-gradient(180deg, #4a2525 0%, #3a1a1a 100%);
  border: 2px solid var(--rust-red);
  border-radius: 4px;
  color: #e8a0a0;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: all 0.2s ease;
  min-height: 44px;
}
.btn-gothic-danger:hover {
  border-color: var(--rust-red-bright);
  box-shadow: 0 0 15px rgba(184,76,76,0.3);
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "style: add gothic frame CSS utility classes"
```

---

### Task 5: Update Existing Component Styles

**Files:**
- Modify: `src/styles/main.css` (multiple component sections)

- [ ] **Step 1: Update .op-card (operative card) with gothic frame**

Find the `.op-card` rule and update to:

```css
.op-card {
  background:
    repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 6px),
    linear-gradient(135deg, #252830, #1a1d24);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.op-card::before {
  content: '';
  position: absolute;
  top: 4px; left: 4px; right: 4px; bottom: 4px;
  border: 1px solid var(--imperial-gold-glow);
  border-radius: 2px;
  pointer-events: none;
}
.op-card:hover {
  border-color: var(--imperial-gold);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4), 0 0 10px var(--gold-glow);
}
```

Update `.op-card.sm-team` border-color to `var(--sm-blue)` and `.op-card.pm-team` border-color to `var(--pm-green)`.

- [ ] **Step 2: Update .active-card (center activation panel)**

Find `.active-card` and update to:

```css
.active-card {
  background:
    repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 6px),
    linear-gradient(180deg, var(--panel-bg), var(--panel-bg-deep));
  border: 2px solid var(--panel-border);
  outline: 1px solid var(--panel-border-outer);
  outline-offset: 3px;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  position: relative;
  box-shadow: 0 6px 24px rgba(0,0,0,0.5), inset 0 0 30px rgba(201,168,76,0.02);
}
```

- [ ] **Step 3: Update .battle-log-card**

Find `.battle-log-card` and update to:

```css
.battle-log-card {
  background:
    repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 6px),
    linear-gradient(180deg, var(--panel-bg), var(--panel-bg-deep));
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
```

- [ ] **Step 4: Update .modal-content**

Find `.modal-content` and update to:

```css
.modal-content {
  background:
    repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 6px),
    linear-gradient(180deg, #2a2d35, #1e2128);
  border: 2px solid var(--panel-border);
  outline: 1px solid var(--panel-border-outer);
  outline-offset: 3px;
  border-radius: 6px;
  padding: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.7), inset 0 0 40px rgba(201,168,76,0.02);
  position: relative;
}
.modal-content::before {
  content: '';
  position: absolute;
  top: 6px; left: 6px; right: 6px; bottom: 6px;
  border: 1px solid var(--imperial-gold-glow);
  border-radius: 3px;
  pointer-events: none;
}
```

- [ ] **Step 5: Update .btn-large**

Find `.btn-large` and update to:

```css
.btn-large {
  font-family: 'Pirata One', serif;
  font-size: 1rem;
  padding: 14px 32px;
  background: linear-gradient(180deg, #3a3d45 0%, #2a2d35 100%);
  border: 2px solid var(--imperial-gold);
  border-radius: 4px;
  color: var(--imperial-gold-bright);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
  transition: all 0.2s ease;
  min-height: 44px;
}
.btn-large:hover {
  background: linear-gradient(180deg, #454850 0%, #353840 100%);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4), 0 0 15px var(--gold-glow);
}
.btn-large:active {
  background: linear-gradient(180deg, #2a2d35 0%, #1e2128 100%);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
```

- [ ] **Step 6: Update .modal-btn**

Find `.modal-btn` and update to:

```css
.modal-btn {
  font-family: 'Pirata One', serif;
  padding: 10px 20px;
  background: linear-gradient(180deg, #2a2d35 0%, #1e2128 100%);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}
.modal-btn:hover {
  border-color: var(--imperial-gold);
  color: var(--imperial-gold-bright);
}
.modal-btn.primary {
  background: linear-gradient(180deg, #3a3d45 0%, #2a2d35 100%);
  border-color: var(--imperial-gold);
  color: var(--imperial-gold-bright);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
}
.modal-btn.primary:hover {
  box-shadow: 0 0 15px var(--gold-glow);
}
```

- [ ] **Step 7: Update .combat-action-btn**

Find `.combat-action-btn` and update background and border to match gothic style:

```css
.combat-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  background: linear-gradient(180deg, #2a2d35 0%, #1e2128 100%);
  border: 1px solid var(--panel-border);
  color: var(--text-main);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 44px;
}
.combat-action-btn:hover {
  border-color: var(--imperial-gold);
  background: linear-gradient(180deg, #353840 0%, #252830 100%);
  box-shadow: 0 0 10px var(--gold-glow);
}
```

- [ ] **Step 8: Update .ploy-choice-card**

Find `.ploy-choice-card` and update:

```css
.ploy-choice-card {
  background: linear-gradient(180deg, #252830, #1a1d24);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.ploy-choice-card::before {
  content: '';
  position: absolute;
  top: 4px; left: 4px; right: 4px; bottom: 4px;
  border: 1px solid var(--imperial-gold-glow);
  border-radius: 2px;
  pointer-events: none;
}
.ploy-choice-card:hover {
  border-color: var(--imperial-gold);
  box-shadow: 0 0 15px var(--gold-glow);
}
.ploy-choice-card.selected {
  border-color: var(--imperial-gold);
  box-shadow: 0 0 15px var(--gold-glow), inset 0 0 15px rgba(201,168,76,0.05);
}
```

- [ ] **Step 9: Update operative board headers**

Find `.board-header` and update:

```css
.board-header {
  position: relative;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}
.board-header-content {
  position: relative;
  background: linear-gradient(90deg, transparent 0%, #1a2a45 15%, #1e3050 50%, #1a2a45 85%, transparent 100%);
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(74, 106, 154, 0.3);
  z-index: 1;
}
.pm-team .board-header-content {
  background: linear-gradient(90deg, transparent 0%, #1a2d20 15%, #1e3525 50%, #1a2d20 85%, transparent 100%);
  border-bottom-color: rgba(74, 124, 89, 0.3);
}
```

- [ ] **Step 10: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "style: apply gothic frame to all existing components"
```

---

### Task 6: Update Dynamic HTML in ui.js

**Files:**
- Modify: `src/js/ui.js`

- [ ] **Step 1: Add gothic corner ornaments to operative cards**

In `renderOperatives()`, find the HTML generation for each operative card. Add a `✦` ornament as a positioned element. Find the card HTML template and add:
```
<div style="position:absolute;top:4px;right:6px;color:var(--imperial-gold);font-size:10px;opacity:0.4;pointer-events:none;">✦</div>
```
inside each `.op-card` div.

- [ ] **Step 2: Update phase overlay HTML with gothic decorations**

In `showPhaseOverlay()` or the phase overlay rendering, add the gothic arch and corner ornaments to the overlay content box. Find the phase overlay HTML generation and wrap the content with:
```
<div class="gothic-arch"></div>
```
at the top of the overlay box, and add corner ornaments `❧` at top corners.

- [ ] **Step 3: Update startStrategyPhase HTML with gothic divider**

In the `startStrategyPhase()` function, where the ploy selection UI is rendered, replace any plain `<hr>` or separator lines with the gothic divider pattern:
```html
<div class="gothic-divider">
  <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
  <span style="color:var(--imperial-gold);font-size:14px;">✠</span>
  <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
</div>
```

- [ ] **Step 4: Update roster picker headers with faction ornaments**

In `renderRosterPickers()`, add faction-specific ornaments to the roster picker card headers:
- SM header: `⚜` symbols flanking the title
- PM header: `☠` symbols flanking the title

- [ ] **Step 5: Update showTurnEndScoringOverlay with gothic frame**

In `showTurnEndScoringOverlay()` or `renderTurnEndScoringContent()`, add gothic panel class and corner ornaments to the scoring overlay.

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "style: add gothic ornaments to dynamic UI elements"
```

---

### Task 7: Update Dynamic HTML in combat.js

**Files:**
- Modify: `src/js/combat.js`

- [ ] **Step 1: Update combat modal with gothic decorations**

In `openModal()` or the modal opening logic, after the modal is displayed, dynamically inject gothic decorations:
```javascript
const modal = document.getElementById('combat-modal');
const content = modal.querySelector('.modal-content');
// Add gothic arch if not already present
if (!content.querySelector('.gothic-arch')) {
  const arch = document.createElement('div');
  arch.className = 'gothic-arch';
  content.appendChild(arch);
}
```

- [ ] **Step 2: Update duel headers with gothic divider**

In `getMeleeDuelHeaderHtml()` and `getShootDuelHeaderHtml()`, replace the "VS" separator with a gothic-styled divider:
```html
<div style="display:flex;align-items:center;gap:6px;padding:0 8px;">
  <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
  <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
  <span style="font-size:1rem;color:var(--text-muted);font-family:'Pirata One',serif;">VS</span>
  <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
  <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
</div>
```

- [ ] **Step 3: Update melee choice card styling**

In the melee choice card HTML (inside `renderFightStep` step 4), update inline styles to use gothic colors:
- Replace `background: rgba(30, 41, 59, 0.95)` with `background: linear-gradient(180deg, #2a2d35, #1e2128)`
- Replace border colors with `var(--imperial-gold)` for attacker, faction colors for defender
- Add `position:relative` and etched inner frame pattern

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "style: add gothic ornaments to combat UI"
```

---

### Task 8: Final Polish & Verification

**Files:**
- Modify: `src/styles/main.css` (fine-tuning)
- Modify: Any remaining hardcoded colors

- [ ] **Step 1: Search for any remaining old color values**

Run grep searches for any leftover old colors:
```bash
grep -rn "#030712\|#0f172a\|#1e293b\|#eab308\|#1d4ed8\|#15803d\|#a3e635\|#e11d48\|#10b981" src/ index.html
```

Replace any remaining references with the new gothic palette equivalents.

- [ ] **Step 2: Search for any remaining Orbitron references**

```bash
grep -rn "Orbitron" src/ index.html
```

Replace any stragglers with `'Pirata One', serif`.

- [ ] **Step 3: Verify the complete build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Run dev server and manually test**

Run: `npm run dev`

Verify in browser:
1. ✅ Font loads correctly (Pirata One visible in headings)
2. ✅ Color palette applied (steel gray, imperial gold, rust red)
3. ✅ Double borders visible on main panels
4. ✅ Texture overlay subtle but present
5. ✅ Gothic arch decoration on key panels
6. ✅ Corner ornaments visible
7. ✅ Faction banners distinguish SM/PM sides
8. ✅ Buttons have metal gradient feel
9. ✅ All text readable (contrast sufficient)
10. ✅ Responsive layout still works on mobile viewport

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "style: final polish — Imperial Gothic UI redesign complete"
```
