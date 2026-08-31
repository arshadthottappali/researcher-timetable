const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  updateStatus: (text) => ipcRenderer.send('tray-status', text)
});
