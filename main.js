const { app, BrowserWindow, Menu } = require("electron")
const { autoUpdater } = require("electron-updater")

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // 🔥 REMOVE TOP MENU BAR
  Menu.setApplicationMenu(null)

  win.loadFile("index.html")
}

// ---------------- APP LIFECYCLE ----------------

app.whenReady().then(() => {
  createWindow()

  // 🔄 CHECK FOR UPDATES (GitHub Releases)
  autoUpdater.checkForUpdatesAndNotify()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
