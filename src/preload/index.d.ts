import { ElectronAPI } from '@electron-toolkit/preload'

interface NexBoardAPI {
  getPlatform(): Promise<{ platform: string; version: string }>
  httpGet(url: string): Promise<unknown>
  setKiosk(enabled: boolean): void
  pickPhotos(): Promise<string[]>
  readFileAsDataUrl(filePath: string): Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: NexBoardAPI
  }
}
