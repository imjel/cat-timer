class TimerObject extends EventTarget {

	constructor(minutes = 0, seconds = 0) {
		super();
		this.initialTime = minutes * 60 + seconds;
		this.remainingTime = this.initialTime;
		this.isRunning = false;
		this.timerInterval = null;
		this.startTime = null;
		this.pausedTime = null;
		this.totalPauseDuration = 0;
	}

	/* Starts the timer */
	start() {
		if (this.isRunning) return;

		this.isRunning = true;
		this.startTime = new Date().getTime();

		// if it's the first time this timer has started
		if (this.remainingTime === this.initialTime) {
			this.startTime = new Date().getTime();
			this.totalPauseDuration = 0;
		}
		// if the timer is being resumed
		else {
			this.startTime = new Date().getTime() - (this.initialTime - this.remainingTime) * 1000;
		}
		this.pausedTime = null;

		// first update
		this.update();

		// sets timer to update every 1 second
		this.timerInterval = setInterval(() => this.update(), 1000);

		if (this.remainingTime < this.initialTime) {
			this.dispatchEvent(new Event('resume'));
		} else {
			this.dispatchEvent(new Event('start'));
		}
	}

	update() {
		const currentTime = new Date().getTime();
		const elapsedMillis = currentTime - this.startTime - this.totalPauseDuration;
		const elapsedSeconds = Math.floor(elapsedMillis / 1000);

		this.remainingTime = Math.max(this.initialTime - elapsedSeconds, 0);

		// tick event with pretty formatted time
		this.dispatchEvent(new CustomEvent('tick', {
			detail: {
				minutes: Math.floor(this.remainingTime / 60),
				seconds: this.remainingTime % 60,
				total: this.remainingTime,
				formatted: this.formatTime()
			}
		}));

		// if timer is complete
		if (this.remainingTime <= 0) {
			this.stop();
			this.dispatchEvent(new Event('complete'));
		}
	}

	pause() {
		if (!this.isRunning) return;

		clearInterval(this.timerInterval);
		this.timerInterval = null;
		this.isRunning = false;
		this.pausedTime = new Date().getTime();

		this.dispatchEvent(new Event('pause'));
	}

	stop() {
		clearInterval(this.timerInterval);
		this.timerInterval = null;
		this.isRunning = false;
	}

	reset (minutes = null, seconds = null) {
		this.stop();

		// if the user has provided new values, update the timer values
		if (minutes !== null || seconds !== null) {
			this.initialTime = (minutes || 0) * 60 + (seconds || 0);
		}

		this.remainingTime = this.initialTime;
		this.pausedTime = null;

		this.dispatchEvent(new CustomEvent('reset', {
			detail: {
				minutes: Math.floor(this.initialTime / 60),
				seconds: this.remainingTime % 60,
				total: this.remaining,
				formatted: this.formatTime()
			}
		}));

		return this.formatTime();
	}

	formatTime() {
		const mins = Math.floor(this.remainingTime / 60);
		const secs = this.remainingTime % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

}

/* UI */

document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM fully loaded");

	const startButton = document.getElementById("startBtn");
	const resetButton = document.getElementById("resetBtn");
	const pauseButton = document.getElementById("pauseBtn");
	const resumeButton = document.getElementById("resumeBtn");
	const closeButton = document.getElementById("closeBtn");

	const timerDisplay = document.getElementById("time"); // clock
	const timerContainer = document.getElementById("timerDisplay");

	const inputContainer = document.getElementById("input-container");
	const minutesInput = document.getElementById("minutesInput");
	const secondsInput = document.getElementById("secondsInput");

	// cat sprite
	const catContainer = document.getElementById("cat-reading-container");

	const timer = new TimerObject(1, 0); // initial timer

	// initial timer display
	minutesInput.value = 1;
	secondsInput.value = 0;
	timerDisplay.textContent = timer.formatTime();

	// these buttons only display under certain event conditions
	pauseButton.style.display = "none";
	resumeButton.style.display = "none";
	inputContainer.style.display = "none";

	// timer event listeners
	timer.addEventListener('tick', (e) => {
		timerDisplay.textContent = e.detail.formatted;
	});

	timer.addEventListener('complete', () => {
		timerDisplay.textContent = "00:00";
		startButton.style.display = "inline-block";
		pauseButton.style.display = "none";
		resumeButton.style.display = "none";
		timerContainer.classList.add("timer-complete");
		window.location.href = 'ending.html';
	});

	timer.addEventListener('pause', () => {
		startButton.style.display = "none";
		pauseButton.style.display = "none";
		resumeButton.style.display = "inline-block";
	});

	timer.addEventListener('start', () => {
		startButton.style.display = "none";
		pauseButton.style.display = "inline-block";
		resumeButton.style.display = "none";
		timerContainer.classList.remove("timer-complete");
	});

	timer.addEventListener('reset', () => {
		// if the user is setting new input, do not show start button
		if (inputContainer.style.display == "none") {
			startButton.style.display = "inline-block";
		}
		pauseButton.style.display = "none";
		resumeButton.style.display = "none";
		timerContainer.classList.remove("timer-complete");
	});

	timer.addEventListener('resume', () => {
		if (inputContainer.style.display === "none") {
			startButton.style.display = "inline-block";
		}
		// startButton.style.display = "none";
		pauseButton.style.display = "inline-block";
		resumeButton.style.display = "none";
		timerContainer.classList.remove("timer-complete");
	});

	// button click listeners

	startButton.addEventListener("click", () => {
		minutesInput.disabled = true;
		secondsInput.disabled = true;
		startButton.style.display = "none";
		timer.start();
	});

	pauseButton.addEventListener("click", () => {
		timer.pause();
	});

	resetButton.addEventListener("click", () => {
		minutesInput.disabled = false;
		secondsInput.disabled = false;

		const newMins = parseInt(minutesInput.value || 0);
		const newSecs = parseInt(secondsInput.value || 0);

		timer.reset(newMins, newSecs);
  		timerDisplay.textContent = timer.reset(newMins, newSecs);
	});

	resumeButton.addEventListener("click", () => {
		minutesInput.disabled = true;
		secondsInput.disabled = true;
		timer.start();
	});

	closeButton.addEventListener('click', () => {
		inputContainer.style.display = "none";
		catContainer.style.display = "block";
		startButton.style.display = "inline-block";
		resetButton.style.display = "inline-block";
	});

	timerDisplay.addEventListener("click", () => {
		inputContainer.style.display = "block";
		catContainer.style.display = "none";
		startButton.style.display = "none";
		pauseButton.style.display = "none";
		resumeButton.style.display = "none";
		resetButton.style.display = "none";
	});

	// handling timer input
	function updateTimerFromUser() {
		const newMins = parseInt(minutesInput.value || 0);
		const newSecs = parseInt(secondsInput.value || 0);

		timer.reset(newMins, newSecs);
		timerDisplay.textContent = timer.formatTime();
	}

	// input state listeners: 
	minutesInput.addEventListener("input", function () {
		if (!timer.isRunning) {
			updateTimerFromUser();
		}
	});

	secondsInput.addEventListener("input", function () {
		if (!timer.isRunning) {
			updateTimerFromUser();
		}
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
