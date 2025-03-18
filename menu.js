document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM fully loaded");

	const menuButton = document.getElementById("menuBtn");
	const catSprite = document.getElementById("cat-sprite");
	const totalSteps = 9;
	let currentStep = 1;
	const speed = 200;
	let animationInterval;

	function updateSprite() {
		catSprite.src = `./assets/cat/cat${currentStep}.png`;
		currentStep = currentStep % totalSteps + 1;
	}

	function startAnimation() {
		if (animationInterval) {
			clearInterval(animationInterval);
		}

		animationInterval = setInterval(updateSprite, speed);
	}

	startAnimation();

	menuButton.addEventListener('click', () => {
		window.location.href = 'timer.html';
	});

	document.getElementById('minimizeBtn').addEventListener('click', () => {
		window.minimize()
	})

	document.getElementById('closeWindowBtn').addEventListener('click', () => {
		window.close()
	})

});