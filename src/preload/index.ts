import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getPlatform: (): Promise<{ platform: string; version: string }> =>
    ipcRenderer.invoke('platform:get'),
  httpGet: (url: string): Promise<unknown> =>
    ipcRenderer.invoke('http:get', url),
  setKiosk: (enabled: boolean): void =>
    ipcRenderer.send('window:set-kiosk', enabled)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error: window.electron is declared in preload/index.d.ts
  window.electron = electronAPI
  // @ts-expect-error: window.api is declared in preload/index.d.ts
  window.api = api
}
