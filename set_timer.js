document.addEventListener('DOMContentLoaded', () => {
	const closeButton = document.getElementById("closeBtn");

	closeButton.addEventListener('click', () => {
		window.location.href = "timer.html";
	});

});