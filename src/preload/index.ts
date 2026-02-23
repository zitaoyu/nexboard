import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getPlatform: (): Promise<{ platform: string; version: string }> =>
    ipcRenderer.invoke('platform:get'),
  httpGet: (url: string): Promise<unknown> =>
    ipcRenderer.invoke('http:get', url)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
