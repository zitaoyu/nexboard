# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Electron app with hot reload
npm run dev:clean    # Start with wiped userData (fresh state)
npm run build        # Compile source only (outputs to out/) — does NOT produce an installer
npm run package      # Full release build: typecheck → lint → test → electron-builder installer in dist/
npm run typecheck    # TypeScript type checking (both main and renderer)
npm run lint         # ESLint (report only)
npm run lint:fix     # ESLint with auto-fix
npm run test         # Run unit tests once (Vitest)
npm run test:watch   # Run tests in watch mode
```

## Testing

108 unit tests live in `src/**/__tests__/` directories, co-located with the source they cover:

- `stores/__tests__/` — all three Zustand stores (dashboard, mini-program, settings)
- `widgets/__tests__/` — widget registry
- `mini-programs/__tests__/` — mini-program registry + widget auto-forwarding
- `mini-programs/todo/__tests__/` — todo store

The `prepackage` npm lifecycle hook runs `typecheck && lint && test` automatically before every `npm run package`, so the suite gates every release build.

When adding a new store or registry, create a matching `__tests__/` file. Use `store.setState({ ...data })` (merge, not replace) to reset state in `beforeEach`.

## Task tracking

Pending and completed features are tracked in `TODOs.txt` at the repo root. When implementing a feature, move its line from `TODO` to `DONE` and change `[ ]` to `[x]`. When adding new planned work, append it under `TODO`.

## Architecture

NexBoard is an Electron desktop app. The codebase follows the standard Electron three-process model:

- **`src/main/`** — Node.js process. Owns the `BrowserWindow`, tray icon, and native OS integration. `desktop-mode.ts` contains stub exports (desktop mode currently disabled).
- **`src/preload/`** — Context bridge. Exposes `window.electron` (from `@electron-toolkit/preload`) and `window.api` to the renderer. Any new main↔renderer communication must be declared here and in `index.d.ts`.
- **`src/renderer/src/`** — React 18 app with TailwindCSS v4. The `@/` alias maps to this directory.

### Two extension systems that mirror each other

**Widgets** live on the dashboard grid. Every widget module exports a `WidgetDefinition` (from `types/widget.ts`):
```
manifest  →  id, name, defaultSize, minSize, maxSize, sourceProgram
Component →  receives { instanceId, config, onConfigChange }
SettingsComponent?  →  same props, rendered in place of Component when gear icon is clicked
```
Registering: import the definition in `widgets/registry.ts` and call `widgetRegistry.register(...)`.

**Mini programs** are full-screen apps opened from the launcher. Every mini program exports a `MiniProgramDefinition` (from `types/mini-program.ts`):
```
manifest      →  id, name, icon (lucide-react name), color (CSS value)
AppComponent  →  rendered when the program is opened
widgets[]     →  WidgetDefinitions this program contributes to the dashboard
```
Registering: import the definition in `mini-programs/registry.ts` and call `miniProgramRegistry.register(...)`. The registry automatically forwards all `widgets[]` entries into the widget registry, namespaced by program id (e.g. `stock-tracker:ticker`).

### State management

Three Zustand stores, all persisted to `localStorage`:

| Store | Key | What it holds |
|-------|-----|---------------|
| `dashboard-store` | `nexboard-dashboard` | `WidgetInstance[]` — the placed widgets and their grid positions |
| `mini-program-store` | *(not persisted)* | `activeProgramId`, `showLauncher` |
| `settings-store` | `nexboard-settings` | `widgetBackgroundOpacity`, `dashboardBackgroundOpacity`, `uiScale` |

`WidgetInstance.config` is a free-form `Record<string, unknown>` — widget components read/write their own config keys, merged via `updateWidgetConfig`.

### IPC pattern

Renderer → Main: `window.electron.ipcRenderer.send('window:minimize')` (fire-and-forget)
Renderer → Main (with reply): `window.api.getPlatform()` → `ipcMain.handle('platform:get', ...)`
Main → Renderer: `win.webContents.send('desktop-mode:changed', enabled)`

New IPC channels must be registered in `src/main/ipc-handlers.ts` and exposed via `src/preload/index.ts`.

### Path alias

The `@/` alias (configured in `electron.vite.config.ts` and `tsconfig.web.json`) resolves to `src/renderer/src/`. Use it for all renderer imports.
