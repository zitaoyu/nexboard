# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Electron app with hot reload
npm run build        # Compile source only (outputs to out/) — does NOT produce an installer
npm run package      # Full build + electron-builder → produces installer in dist/
npm run typecheck    # TypeScript type checking (both main and renderer)
npm run lint         # ESLint with auto-fix
```

There are no automated tests. Verification is done by running `npm run dev` and testing manually.

## Architecture

NexBoard is an Electron desktop app. The codebase follows the standard Electron three-process model:

- **`src/main/`** — Node.js process. Owns the `BrowserWindow`, tray icon, and native OS integration. `desktop-mode.ts` uses `setAlwaysOnTop(true, 'normal', -100)` plus a blur-event handler to keep the window permanently below all other windows.
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
| `mini-program-store` | *(not persisted)* | `activeProgramId` — which mini program is open |
| `settings-store` | `nexboard-settings` | `finnhubApiKey` |

`WidgetInstance.config` is a free-form `Record<string, unknown>` — widget components read/write their own config keys, merged via `updateWidgetConfig`.

### IPC pattern

Renderer → Main: `window.electron.ipcRenderer.send('window:minimize')` (fire-and-forget)
Renderer → Main (with reply): `window.api.getPlatform()` → `ipcMain.handle('platform:get', ...)`
Main → Renderer: `win.webContents.send('desktop-mode:changed', enabled)`

New IPC channels must be registered in `src/main/ipc-handlers.ts` and exposed via `src/preload/index.ts`.

### Path alias

The `@/` alias (configured in `electron.vite.config.ts` and `tsconfig.web.json`) resolves to `src/renderer/src/`. Use it for all renderer imports.
