const { app, BrowserWindow } = require("electron");
const path = require("node:path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 380,
    height: 480,
    resizable: false,
    alwaysOnTop: true,
    autoHideMenuBar: true, 
    icon: path.join(__dirname, 'assets/album.ico'),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, 
      contextIsolation: false, 
    },
  });

  mainWindow.setMenuBarVisibility(false); // Ensure menu bar is hidden
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
