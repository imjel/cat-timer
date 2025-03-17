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
  });