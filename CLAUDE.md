# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Pokenexo is a Pokémon-themed clone of conexo.ws / NYT Connections. Players form 4 groups of 4 Pokémon connected by a hidden theme. UI text is in Brazilian Portuguese.

## Running

No build, bundler, package manager, or test framework — pure static HTML/CSS/vanilla JS. Open `index.html` directly in a browser, or serve the directory with any static server (e.g. `python3 -m http.server 8000`) and visit the printed URL. There are no dependencies to install and no lint/test commands to run.

## Architecture

Scripts in `index.html` are loaded as plain `<script>` tags (no modules) in a fixed order so later files can reference globals defined earlier: `games.js → storage.js → share.js → home.js → game.js → app.js`. When adding a new file, insert it in this dependency order.

**Routing** (`js/app.js`) is hash-based. `#/` renders the home; `#/game/:id` renders a puzzle. `route()` runs on `DOMContentLoaded` and `hashchange`, replaces `#app` innerHTML, and removes any lingering victory backdrop on transitions.

**Data** (`js/games.js`) — `GAMES` is the single source of truth: an array of puzzles, each with 4 `groups` of 3 `words`. Every group has a fixed `color` (`yellow | green | blue | purple`) which doubles as its identity in state and CSS (`color-${color}` classes in `css/styles.css`) and as a key into `COLOR_EMOJI` for share strings. To add a puzzle, append an entry with a new `id` and the four colors above.

**Persistence** (`js/storage.js`) — Per-game state is stored in `localStorage` under the single key `pokenexo:v2` as `{ games: { [id]: state } }`. `saveGameState(id, patch)` does a shallow merge against `defaultGameState()` and returns the merged result; callers (`game.js`) reassign `ctx.state = saveGameState(...)` after every mutation rather than mutating in place. The persisted shape — `{ solved, attempts, selectedWords, solvedGroups, guessHistory, solveOrder }` — is also what drives rendering, so changes to it must be reflected in `defaultGameState`, `renderState`, and the home-screen status logic in `home.js`. `attempts` counts every evaluated guess (correct or wrong).

**Game loop** (`js/game.js`) — `renderGame` builds the DOM once, stores element refs and the game in a `ctx` object, then `renderState(ctx)` re-renders the grid and solved bars from `ctx.state` after each change. The grid layout uses `seededShuffle(words, gameId * 1000 + 7)` so word order is deterministic per puzzle across reloads. `ctx.busy` blocks input during the 350–500ms delays around guess evaluation and the shake animation.

**Share** (`js/share.js`) — `buildShareText` emits emoji squares ordered by `solveOrder` (the order the player solved groups, not the canonical group order), so the share string reflects the play-through. `copyToClipboard` falls back to a hidden `<textarea>` + `execCommand("copy")` when the async Clipboard API is unavailable.
