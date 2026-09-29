const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 980,
    minHeight: 700,
    title: 'Hastaloka — Sistem Diagnostik & Navigasi Keputusan',
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler for native PDF print or save
ipcMain.handle('print-to-pdf', async () => {
  if (!mainWindow) return { success: false, error: 'Window not found' };
  try {
    const pdfData = await mainWindow.webContents.printToPDF({
      printBackground: true,
      landscape: false,
      pageSize: 'A4',
    });
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Simpan Laporan Hastaloka ke PDF',
      defaultPath: `Laporan-Hastaloka-${Date.now()}.pdf`,
      filters: [{ name: 'Dokumen PDF', extensions: ['pdf'] }],
    });
    if (filePath) {
      const fs = require('fs');
      await fs.promises.writeFile(filePath, pdfData);
      return { success: true, filePath };
    }
    return { success: false, cancelled: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC Handler for native AI requests (zero browser CORS restrictions)
ipcMain.handle('ai-request', async (event, { url, method, headers, body }) => {
  try {
    const res = await fetch(url, {
      method: method || 'POST',
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 500, error: err.message };
  }
});
