class TimerObject extends EventTarget {

	constructor(minutes = 0, seconds = 0) {
		super();
		this.initialTime = minutes * 60 + seconds;
		this.remainingTime = this.initialTime;
		this.isRunning = false;
		this.timerInterval = null;
		this.startTime = null;
		this.pausedTime = null;
	}

	/* Starts the timer */
	start() {
		if (this.isRunning) return;

		this.isRunning = true;
		this.startTime = new Date().getTime();

		if (this.pausedTime) {
			this.totalPauseDuration += (new Date().getTime() - this.pausedTime);
			this.pausedTime = null;
		}

		this.update();

		// set interval for updates
		this.timerInterval = setInterval(() => this.update(), 1000);

		this.dispatchEvent(new Event('start'));
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
			this.dispatchEvent(new Event ('complete'));
		}
	}

	pause() {
		if (!this.isRunning) return;

		clearInterval(this.timerInterval);
		this.isRunning = false;
		this.pausedTime = new Date.getTime();

		this.dispatchEvent(new Event('pause'));
	}

	stop() {
		clearInterval(this.timerInterval);
		this.timerInterval = null;
		this.isRunning = false;
	}

	reset(minutes = null, seconds = null) {
		this.stop();

		// if the user has provided new values, update the timer values
		if (minutes !== null || seconds !== null) {
			this.initialTime = (minutes || 0) * 60 + (seconds || 0);
		}
		
		this.remainingTime = this.initialTime;
		this.totalPauseDuration = 0;
		this.pausedTime = null;

		this.dispatchEvent(new CustomEvent('reset', {
			detail: {
			  minutes: Math.floor(this.remaining / 60),
			  seconds: this.remaining % 60,
			  total: this.remaining,
			  formatted: this.formatTime()
			}
		}));
	}

	formatTime() {
		const mins = Math.floor(this.remainingTime / 60);
		const secs = this.remainingTime % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	getTimeRemaining() {
		return {
			minutes: Math.floor(this.remainingTime / 60),
			seconds: this.remainingTime % 60,
			total: this.remainingTime,
			formatted: this.formatTime()
		  };
	}

}

module.exports = timers;