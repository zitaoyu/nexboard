import { ipcMain, BrowserWindow, net, dialog } from 'electron'
import { platform } from 'os'
import { readFile } from 'fs/promises'
import { extname } from 'path'

const IMAGE_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
}

export function registerIpcHandlers(): void {
  ipcMain.handle('platform:get', () => {
    return { platform: platform(), version: process.versions.electron }
  })

  ipcMain.on('window:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })

  ipcMain.on('window:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })

  ipcMain.on('window:set-kiosk', (event, enabled: boolean) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.setFullScreen(enabled)
  })

  ipcMain.handle('http:get', async (_event, url: string) => {
    const res = await net.fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    return res.json()
  })

  ipcMain.handle('dialog:pick-photos', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog.showOpenDialog(win!, {
      title: 'Select Photos',
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'] },
      ],
    })
    return result.canceled ? [] : result.filePaths
  })

  ipcMain.handle('files:read-as-data-url', async (_event, filePath: string) => {
    const buf = await readFile(filePath)
    const mime = IMAGE_MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
    return `data:${mime};base64,${buf.toString('base64')}`
  })
}
