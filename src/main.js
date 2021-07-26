const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
      width: 1400,
      height: 800,
      minWidth: 1400,
      minHeight: 600,
      frame: false,
      icon: 'public/img/logo.ico',
      webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
      }
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('index.html');

  return mainWindow;
}

app.whenReady().then(() => {
  const mainWindow = createWindow();

  app.on('activate', () => {
      if(BrowserWindow.getAllWindows().length == 0) createWindow();
  });

  ipcMain.on('app:minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('app:maximize', () => {
    if(!mainWindow.isMaximized())
      mainWindow.maximize();
    else
      mainWindow.unmaximize();
  });

  ipcMain.on('app:quit', () => {
    app.quit();
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit();
});