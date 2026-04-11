import { ElectronAPI } from '@electron-toolkit/preload'

interface NexBoardAPI {
  getPlatform(): Promise<{ platform: string; version: string }>
  httpGet(url: string, headers?: Record<string, string>): Promise<unknown>
  pickPhotos(): Promise<string[]>
  readFileAsDataUrl(filePath: string): Promise<string>
  resetWindowBounds(): void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: NexBoardAPI
  }
}
