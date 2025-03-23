document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM fully loaded");
	
	const menuButton = document.getElementById("menuBtn");
	const restartButton = document.getElementById("restartBtn");
	var ding = new Audio("./assets/ding.mp3"); 

	ding.play();

	restartButton.addEventListener('click', () => {
		window.location.href = 'timer.html';
	  });
	
	menuButton.addEventListener('click', () => {
	  window.location.href = 'index.html';
	});

	document.getElementById('minimizeBtn').addEventListener('click', () => {
		const { ipcRenderer } = require('electron');
		ipcRenderer.send('minimize-window');
	})

	document.getElementById('closeWindowBtn').addEventListener('click', () => {
		window.close()
	})

  });