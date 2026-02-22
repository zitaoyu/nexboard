import { ElectronAPI } from '@electron-toolkit/preload'

interface NexBoardAPI {
  getPlatform(): Promise<{ platform: string; version: string }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: NexBoardAPI
  }
}
