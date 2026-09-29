const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  printToPDF: () => ipcRenderer.invoke('print-to-pdf'),
  requestAI: (options) => ipcRenderer.invoke('ai-request', options),
});
