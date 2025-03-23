require('update-electron-app')()
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

let mainWindow;

function createWindow() {

	mainWindow = new BrowserWindow({
		icon: '/path/to/icon.png',
		width: 400,
		height: 480,
		resizable: false,
		frame: false, // remove default titlebar
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		}
	})

	// load the index.html of the app.
	mainWindow.loadFile('index.html')

	mainWindow.setAutoHideMenuBar(true);
	mainWindow.autoHideMenuBar(true);

	// DevTools:
	//   mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('minimize-window', () => {
	if (mainWindow) mainWindow.minimize();
  });