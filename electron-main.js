const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const { startServer } = require('./server');

const PORT = Number(process.env.PORT) || 3000;
let mainWindow = null;
let localServer = null;

function createWindow() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'icon-512.png'));

  mainWindow = new BrowserWindow({
    width: 430,
    height: 860,
    minWidth: 360,
    minHeight: 640,
    backgroundColor: '#0f1117',
    title: "Researcher's Timetable",
    autoHideMenuBar: true,
    icon: icon.isEmpty() ? undefined : icon,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
}

app.whenReady().then(() => {
  localServer = startServer(PORT);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (localServer) {
    localServer.close();
    localServer = null;
  }
});
