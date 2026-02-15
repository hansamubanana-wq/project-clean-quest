# CLAUDE.md — Project Clean Quest

## Project Overview

**Project Clean Quest** is a gamified school cleaning app prototype built as a static web application. It transforms mundane cleaning duties into RPG-style quests for students at Seiryo Junior & Senior High School (青稜中学校・高等学校). The app is a front-end-only prototype (no backend) designed for presentation/demo purposes.

The primary language of the UI and all user-facing text is **Japanese**.

## Repository Structure

```
project-clean-quest/
├── index.html      # Main app — the gamified cleaning quest UI
├── demo.html       # Presentation slides (Reveal.js) for pitching the project
├── script.js       # App logic: screen navigation, QR scanning, game actions
├── style.css       # All styling — RPG-themed bright design with CSS custom properties
└── CLAUDE.md       # This file
```

### File Descriptions

- **`index.html`** — Single-page app with multiple "screens" toggled via JS. Contains: home screen (quest board), map screen (floor plan), ranking screen, status/profile screen ("生徒手帳"), QR scan screen, and overlay modals for quest start and reward popups.
- **`demo.html`** — A Reveal.js slide deck for presenting the project concept. Embeds `index.html` as a live demo via iframe. Optimized for iPad (1024x768).
- **`script.js`** — Vanilla JavaScript. Handles screen switching, camera-based QR code scanning (via jsQR library), quest state transitions, and UI updates. No framework or build step.
- **`style.css`** — CSS using custom properties (`:root` variables). RPG-themed bright design with pixel-art font (DotGothic16), animated transitions, and responsive layout targeting mobile (max-width: 400px game frame).

## Tech Stack

- **Pure HTML/CSS/JavaScript** — No framework, no build tools, no package manager
- **External CDN dependencies:**
  - [jsQR](https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js) — QR code scanning from camera feed
  - [Reveal.js 4.5.0](https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/) — Presentation framework (demo.html only)
  - [DotGothic16](https://fonts.googleapis.com/css2?family=DotGothic16) — Pixel-art style Google Font
  - [DiceBear Pixel Art](https://api.dicebear.com/7.x/pixel-art/svg) — Avatar generation (CSS background-image)

## Development Workflow

### Running Locally

No build step is needed. Open `index.html` directly in a browser, or serve via any static file server:

```bash
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .
```

> **Note:** QR scanning requires HTTPS or localhost due to `navigator.mediaDevices.getUserMedia` restrictions. Camera access will not work over plain HTTP on a remote server.

### No Build / Lint / Test Commands

This project has no `package.json`, no bundler, no linter, and no test suite. All code is vanilla and runs directly in the browser.

## Architecture & Patterns

### Screen Navigation

The app uses a single-page pattern with CSS-based screen toggling:

- Each screen is a `<div class="screen">` inside `#screen-area`
- Only one screen has the `.active` class at a time
- Navigation is handled by `showScreen(screenId)` in `script.js`
- Screen IDs: `home-screen`, `map-screen`, `rank-screen`, `mypage-screen`, `scan-screen`

### QR Code Scanning Flow

1. `startScan()` → activates camera via `getUserMedia`
2. Continuous frame scanning via `requestAnimationFrame` loop (`tick()`)
3. Each frame drawn to hidden `<canvas>`, processed by `jsQR`
4. Expected QR payload: `"QUEST-START-303"` (hardcoded)
5. On match → `showSuccessModal()` → modal overlay + button state change

### Modal / Overlay System

- Two overlay modals: `#success-overlay` (quest start) and `#popup-overlay` (reward)
- Toggled via `style.display = 'flex' | 'none'`
- Styled with `backdrop-filter: blur()` for iOS compatibility

### CSS Design System

- CSS custom properties defined in `:root` (see `style.css:1-10`)
- Color palette: sky blue background (`#f0f8ff`), blue primary (`#4da6ff`), orange accent (`#ff9900`)
- RPG-themed UI classes: `.rpg-box`, `.rpg-btn`, `.rpg-modal`
- Button variants: `.primary`, `.white-btn`, `.reward-btn`, `.back-btn`
- Shadow effect: `.shadow-pop` class for 3D button appearance
- Animations: `popIn`, `bounceIn`, `pulseRed`, `spin` (defined via `@keyframes`)

## Coding Conventions

- **Language:** All comments, variable descriptions, and commit messages are in **Japanese**
- **No modules/imports:** Everything is global scope vanilla JS
- **Inline event handlers:** HTML uses `onclick="functionName()"` pattern
- **DOM manipulation:** Direct `document.getElementById` / `querySelector` — no abstraction layer
- **No semicolons inconsistency:** The codebase sometimes uses semicolons and sometimes omits them — follow whichever style is used in the surrounding code
- **Commit messages:** Written in Japanese, describing what changed (e.g., "HTMLファイルを更新し、プレゼンテーション用の内容をゲームフレームに統合")

## Key Constants & Hardcoded Values

- QR code expected value: `"QUEST-START-303"` (`script.js:46`)
- Target room: `303` (classroom number used throughout)
- Student name: `土蔵 創一` / Class: `3年3組 21番`
- XP values in ranking: `5240`, `4950`, `4800` (static, not computed)
- Game frame dimensions: `max-width: 400px`, `height: 750px`

## Important Notes for AI Assistants

1. **This is a prototype/demo** — There is no backend, no database, no authentication. All data is static HTML.
2. **Japanese-first codebase** — Maintain Japanese for all user-facing strings, comments, and commit messages.
3. **No build system** — Do not introduce package.json, bundlers, or transpilers unless explicitly requested.
4. **Camera API sensitivity** — Changes to the QR scanning flow should preserve the `getUserMedia` → `requestAnimationFrame` → `jsQR` pipeline and handle cleanup via `stopScan()`.
5. **Mobile-first design** — The game frame is designed for phone-sized viewports (400px wide). Test layout changes at this width.
6. **Presentation file** — `demo.html` embeds `index.html` via iframe. Changes to index.html are immediately reflected in the presentation demo.
