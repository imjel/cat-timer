document.addEventListener('DOMContentLoaded', () => {
	const { remote } = require('electron')
	const win = remote.getCurrentWindow()
	
	document.getElementById('minimizeBtn').addEventListener('click', () => {
	  win.minimize()
	})
	
	document.getElementById('closeWindowBtn').addEventListener('click', () => {
	  win.close()
	})
})