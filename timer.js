
document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM fully loaded");

	// DOM
	const timerDisplay = document.getElementById("time");
	const startButton = document.getElementById("startBtn");
	const resetButton = document.getElementById("resetBtn");
	const pauseButton = document.getElementById("pauseBtn");
	const resumeButton = document.getElementById("resumeBtn");
	const timerContainer = document.getElementById("timerDisplay");
	const inputContainer = document.getElementById("input-group");
	const minutesInput = document.getElementById("minutesInput");
  	const secondsInput = document.getElementById("secondsInput");

	// cat animation variables
	const catSprite = document.getElementById("cat-reading-sprite");
	const totalSteps = 9;
	let currentStep = 1;
	const speed = 150;
	let animationInterval;

	// cat animation
	function updateSprite() {
		catSprite.src = `./assets/reading_cat/reading_cat${currentStep}.png`;
		currentStep = currentStep % totalSteps + 1;
	}

	function startAnimation() {
		if (animationInterval) {
			clearInterval(animationInterval);
		}

		animationInterval = setInterval(updateSprite, speed);
	}

	startAnimation();


	// timer variables
	let minutes = 1;
	let seconds = minutes * 60;
	let isRunning = false;
	let timerInterval = null;
	let startTime = null;
	let pauseMins = null; // if pause button is pressed, save the remaining time
	let pauseSecs = null;
	let formatting = formatTime();

	// events
	const tickEvent = new CustomEvent('tick', {
		detail: {
			mins: minutes,
			secs: 0,
			seconds: seconds,
			formatting: formatting
		}
	});
	const completeEvent = new Event('complete');
	const pauseEvent = new Event('pause');
	const resumeEvent = new Event('resume');

	pauseButton.style.display = "none";
	resumeButton.style.display = "none";

	// formatting the clock with padding
	function formatTime() {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	// updates the timer's state
	function update() {
		const timeNow = new Date().getTime();
		const timeElapsed = Math.floor((timeNow - startTime) / 1000);

		seconds = Math.max(minutes * 60 - timeElapsed, 0);
		formatting = formatTime();

		// Create new tick event with updated values
		const newTickEvent = new CustomEvent('tick', {
			detail: {
				mins: Math.floor(seconds / 60),
				secs: Math.floor(seconds % 60),
				seconds: seconds,
				formatting: formatting
			}
		});

		document.dispatchEvent(newTickEvent);

		// if the timer is complete, dispatch complete event
		if (seconds <= 0) {
			pause();
			document.dispatchEvent(completeEvent);

			window.location.href = 'ending.html';
		}
	}

	// start timer
	function start() {
		if (!isRunning) {
			updateTimerFromUser();

			isRunning = true;
			startTime = new Date().getTime();

			// update the time and display, then set the interval
			update();
			timerInterval = setInterval(update, 1000);
		}
	}

	// pause timer
	function pause() {
		if (isRunning) {
			pauseMins = minutes;
			pauseSecs = seconds;
			clearInterval(timerInterval);
			timerInterval = null;
			isRunning = false;
			document.dispatchEvent(pauseEvent);
		}
	}

	// reset timer
	function reset() {
		pause();
		updateTimerFromUser();
		formatting = formatTime();

		const resetTickEvent = new CustomEvent('tick', {
			detail: {
				mins: minutes,
				secs: 0,
				seconds: seconds,
				formatting: formatting
			}
		});

		document.dispatchEvent(resetTickEvent);
	}

	// resume timer from where it was paused
	function resume() {
		if (!isRunning) {

			minutes = pauseMins || minutes;
			seconds = pauseSecs || seconds;
			
			startTime = new Date().getTime() - ((minutes * 60) - seconds) * 1000;
			isRunning = true;
			timerInterval = setInterval(update, 1000);

			document.dispatchEvent(resumeEvent);
		}
	}

	// handling timer input

	function updateTimerFromUser() {
		const newMins = parseInt(minutesInput.value || 0);
		const newSecs = parseInt(secondsInput.value || 0);

		minutes = newMins;
		seconds = (newMins * 60) + newSecs;

		formatting = formatTime();
		timerDisplay.textContent = formatting;

	}

	// event listeners for the timer
	document.addEventListener('tick', function (e) {
		timerDisplay.textContent = e.detail.formatting;
	});

	document.addEventListener('complete', function () {
		timerDisplay.textContent = "00:00";
		startButton.style.display = "inline-block";
		pauseButton.style.display = "none";
		resumeButton.style.display = "none";
		timerContainer.classList.add("timer-complete");
	});

	document.addEventListener('pause', function () {
		startButton.style.display = "none";
		pauseButton.style.display = "none";
		resumeButton.style.display = "inline-block";
	});

	document.addEventListener('reset', function () {
		startButton.style.display = "inline-block";
		pauseButton.style.display = "none";
		resumeButton.style.display = "none";
		timerContainer.classList.remove("timer-complete");
	});

	document.addEventListener('resume', function() {
		startButton.style.display = "none";
		pauseButton.style.display = "inline-block";
		resumeButton.style.display = "none";
	})

	// button event handlers
	startButton.addEventListener("click", function () {
		if (!isRunning) {
			if (seconds <= 0) {
				reset();
			}

			// cannot set the timer while it is running
			minutesInput.disabled = true;
			secondsInput.disabled = true;

			start();
			startButton.style.display = "none";
			resumeButton.style.display = "none";
			pauseButton.style.display = "inline-block";
			timerContainer.classList.remove("timer-complete");
		}
	});

	pauseButton.addEventListener("click", function () {
		pause();
		minutesInput.disabled = true;
		secondsInput.disabled = true;
	});

	resetButton.addEventListener("click", function () {
		reset();
		startButton.style.display = "inline-block";
		resumeButton.style.display = "none";
		pauseButton.style.display = "none";
		minutesInput.disabled = false;
		secondsInput.disabled = false;
	});

	resumeButton.addEventListener("click", function () {
		resume();
		startButton.style.display = "none";
		resumeButton.style.display = "none";
		pauseButton.style.display = "inline-block";
		minutesInput.disabled = true;
		secondsInput.disabled = true;
	})


	minutesInput.addEventListener("input", function () {
		if (!isRunning) {
			updateTimerFromUser();
		}
	});

	secondsInput.addEventListener("input", function () {
		if (!isRunning) {
			updateTimerFromUser();
		}
	});

	// initialize the display
	minutesInput.value = 1;
	secondsInput.value = 0;
	timerDisplay.textContent = formatting;
	
});



