import { ElectronAPI } from '@electron-toolkit/preload'

interface NexBoardAPI {
  getPlatform(): Promise<{ platform: string; version: string }>
  httpGet(url: string): Promise<unknown>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: NexBoardAPI
  }
}
