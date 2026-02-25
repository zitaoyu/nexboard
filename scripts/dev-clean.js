#!/usr/bin/env node
// Launches electron-vite dev with NEXBOARD_CLEAN=1 so the main process
// starts with a wiped userData directory (no saved settings, layout, or window state).
const { spawn } = require('child_process')

const proc = spawn('npx', ['electron-vite', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NEXBOARD_CLEAN: '1' }
})

proc.on('exit', (code) => process.exit(code ?? 0))
