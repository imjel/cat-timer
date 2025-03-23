document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM fully loaded");

	const menuButton = document.getElementById("menuBtn");

	menuButton.addEventListener('click', () => {
		window.location.href = 'timer.html';
	});

	// titlebar functionality
	document.getElementById('minimizeBtn').addEventListener('click', () => {
		const { ipcRenderer } = require('electron');
		ipcRenderer.send('minimize-window');
	})

	document.getElementById('closeWindowBtn').addEventListener('click', () => {
		window.close()
	})

});