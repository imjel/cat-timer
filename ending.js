document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM fully loaded");
	
	const menuButton = document.getElementById("menuBtn");
	const restartButton = document.getElementById("restartBtn");

	restartButton.addEventListener('click', () => {
		window.location.href = 'timer.html';
	  });
	
	menuButton.addEventListener('click', () => {
	  window.location.href = 'index.html';
	});

	document.getElementById('minimizeBtn').addEventListener('click', () => {
		window.minimize()
	})

	document.getElementById('closeWindowBtn').addEventListener('click', () => {
		window.close()
	})

  });