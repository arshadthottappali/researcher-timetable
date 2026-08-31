const { app, BrowserWindow, nativeImage, Tray, ipcMain } = require('electron');
const path = require('path');
const { startServer } = require('./server');

const PORT = Number(process.env.PORT) || 3000;
let mainWindow = null;
let localServer = null;
let tray = null;

function createWindow() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'icon-512.png'));

  mainWindow = new BrowserWindow({
    width: 430,
    height: 860,
    minWidth: 360,
    minHeight: 640,
    backgroundColor: '#182620',
    title: "Researcher's Timetable",
    autoHideMenuBar: true,
    icon: icon.isEmpty() ? undefined : icon,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
}

// A menu-bar/system-tray icon is the desktop equivalent of the mobile app
// badge — glanceable current-block status without an interrupting notification.
function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'icon-192.png'));
  const trayIcon = icon.isEmpty() ? icon : icon.resize({ width: 16, height: 16 });
  tray = new Tray(trayIcon);
  tray.setToolTip("Researcher's Timetable");
  tray.on('click', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });
}

ipcMain.on('tray-status', (_event, text) => {
  if (tray && typeof text === 'string') tray.setToolTip(text.slice(0, 120));
});

app.whenReady().then(() => {
  localServer = startServer(PORT);
  createWindow();
  createTray();

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
