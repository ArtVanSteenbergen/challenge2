var timeOffsetHours = 0;
var timeOffsetMinutes = 0;
var timeOffsetSeconds = 0;
var timeOffset = 0;

function setTimeOffset(type, amount) {
	if (type == 'hours') {
		timeOffsetHours += amount;
		document.getElementById('clock').innerHTML = getTime();
	}
	if (type == 'minutes') {
		timeOffsetMinutes += amount;
		document.getElementById('clock').innerHTML = getTime();
	}
	if (type == 'seconds') {
		timeOffsetSeconds += amount;
		document.getElementById('clock').innerHTML = getTime();
	}
}

function getTime() {
	timeOffset = timeOffsetHours * 3600000 + timeOffsetMinutes * 60000 + timeOffsetSeconds * 1000;
	var date = new Date(Date.now() + timeOffset);
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();

	
	if (h >= 0 && h < 6) {
		document.documentElement.classList.add('night');
	} else {
		document.documentElement.classList.remove('night');
	}
	if (h >= 6 && h < 12) {
		document.documentElement.classList.add('morning');
	} else {
		document.documentElement.classList.remove('morning');
	}
	if (h >= 12 && h < 18) {
		document.documentElement.classList.add('afternoon');
	} else {
		document.documentElement.classList.remove('afternoon');
	}
	if (h >= 18 && h < 24) {
		document.documentElement.classList.add('evening');
	} else {
		document.documentElement.classList.remove('evening');
	}

	if (h.toString().length == 1) {
		h = '0' + h;
	}
	if (m.toString().length == 1) {
		m = '0'  + m;
	}
	if (s.toString().length == 1) {
		s = '0'  + s;
	}
	return h + ':' + m +':' + s;
}


window.onload = function() {
	document.getElementById('clock').innerHTML = getTime();
	setInterval(() => {
		document.getElementById('clock').innerHTML = getTime();
	},1000);
};