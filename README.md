# NexBoard

A customizable desktop dashboard app with widgets and mini programs. The app window stays behind all other windows, acting as a persistent dashboard on your desktop.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

## Getting Started

```bash
# Install dependencies
npm install

# Start in development mode (with hot reload)
npm run dev
```

The app will open as a small window in the top-right corner of your screen.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile source only (outputs to `out/`) |
| `npm run package` | Build + package into an installer (outputs to `dist/`) |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Lint and auto-fix with ESLint |

## Project Structure

```
src/
├── main/                          # Electron main process
│   ├── index.ts                   # Window creation, tray, app lifecycle
│   ├── desktop-mode.ts            # "Always on bottom" window behavior
│   └── ipc-handlers.ts            # IPC message handlers
│
├── preload/                       # Electron preload (context bridge)
│   ├── index.ts                   # Exposes window.electron and window.api
│   └── index.d.ts                 # Type declarations for the exposed APIs
│
└── renderer/                      # React app (renderer process)
    └── src/
        ├── main.tsx               # React entry point
        ├── App.tsx                # Root component
        ├── global.css             # Tailwind imports and global styles
        │
        ├── types/                 # TypeScript interfaces
        │   ├── widget.ts          # WidgetManifest, WidgetInstance, WidgetProps, WidgetDefinition
        │   ├── mini-program.ts    # MiniProgramManifest, MiniProgramDefinition
        │   └── layout.ts         # react-grid-layout types
        │
        ├── stores/                # Zustand state stores (persisted to localStorage)
        │   ├── dashboard-store.ts # Widget instances and grid layout
        │   ├── mini-program-store.ts # Active mini program navigation
        │   └── settings-store.ts  # User settings (API keys)
        │
        ├── components/
        │   ├── layout/
        │   │   ├── AppShell.tsx          # Top-level shell: title bar + content area
        │   │   ├── DashboardGrid.tsx     # react-grid-layout powered widget grid
        │   │   ├── WidgetContainer.tsx   # Widget card wrapper with controls
        │   │   ├── AddWidgetButton.tsx   # FAB + modal to add widgets
        │   │   └── MiniProgramLauncher.tsx # iOS-style mini program picker
        │   └── settings/
        │       └── SettingsPanel.tsx     # Settings modal
        │
        ├── widgets/               # Built-in widgets
        │   ├── registry.ts        # Global widget registry
        │   ├── clock/             # Clock widget (time display)
        │   └── timer/             # Timer widget (countdown/stopwatch)
        │
        └── mini-programs/         # Built-in mini programs
            ├── registry.ts        # Global mini program registry
            └── stock-tracker/     # Stock price tracker (Finnhub API)
                ├── api/           # API client
                ├── hooks/         # React Query hooks
                ├── components/    # UI components
                └── widgets/       # Dashboard widgets provided by this program
```

## Architecture

### Widget System

Widgets are self-contained UI components that live on the dashboard grid. Each widget exports a `WidgetDefinition`:

```typescript
interface WidgetDefinition {
  manifest: WidgetManifest    // id, name, description, default/min/max size
  Component: ComponentType<WidgetProps>          // The widget UI
  SettingsComponent?: ComponentType<WidgetProps>  // Optional settings panel
}
```

To add a new built-in widget:

1. Create a folder under `src/renderer/src/widgets/your-widget/`
2. Create `YourWidget.tsx` (the component), optionally `YourWidgetSettings.tsx`, and `manifest.ts`
3. Register it in `src/renderer/src/widgets/registry.ts`

### Mini Program System

Mini programs are full-screen apps accessible from the launcher. They can also provide widgets for the dashboard. Each exports a `MiniProgramDefinition`:

```typescript
interface MiniProgramDefinition {
  manifest: MiniProgramManifest  // id, name, icon, color
  AppComponent: ComponentType     // Full app UI
  widgets: WidgetDefinition[]     // Widgets this program provides
}
```

To add a new mini program:

1. Create a folder under `src/renderer/src/mini-programs/your-program/`
2. Create the app component, manifest, and optionally widgets
3. Register it in `src/renderer/src/mini-programs/registry.ts`

When a mini program is registered, its widgets are automatically added to the global widget registry with namespaced IDs (e.g. `stock-tracker:ticker`).

### Desktop Mode

The app window always stays behind other windows using `setAlwaysOnTop(true, 'normal', -100)`. A blur handler re-asserts this z-level whenever focus moves away. This works on both Windows and macOS.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Electron + electron-vite |
| UI | React 18, TailwindCSS v4 |
| State | Zustand (with persist middleware) |
| Data fetching | @tanstack/react-query |
| Dashboard grid | react-grid-layout |
| Charts | Recharts |
| Icons | lucide-react |

## Stock Tracker Setup

The stock tracker mini program uses the [Finnhub](https://finnhub.io/) API. To use it:

1. Create a free account at [finnhub.io](https://finnhub.io/)
2. Copy your API key
3. Open NexBoard settings (gear icon) and paste the key
