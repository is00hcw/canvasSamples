var canvas = document.getElementById("canvas"),
	context = canvas.getContext("2d"),
	
	negativeButton = document.getElementById("negativeButton"),
	blackWhiteButton = document.getElementById("blackWhiteButton"),
	embossButton = document.getElementById("embossButton"),
	sunglassButton = document.getElementById("sunglassButton"),
	resetButton = document.getElementById("resetButton"),
	
	image = new Image(),
	
	sunglassFilter = new Worker("js/sunglassFilter.js");

// Functions

function drawInNegative() {
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
		data = imageData.data,
		i;
		
	for (i = 0; i < data.length - 4; i += 4) {
		data[i] = 255 - data[i];
		data[i + 1] = 255 - data[i + 1];
		data[i + 2] = 255 - data[i + 2];
	}
	
	context.putImageData(imageData, 0, 0);
}

function drawInBlackAndWhite() {
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
		data = imageData.data,
		i, average;
		
	for (i = 0; i < data.length - 4; i += 4) {
		average = (data[i] + data[i + 1] + data[i + 2]) / 3;
		
		data[i] = average;
		data[i + 1] = average;
		data[i + 2] = average;
	}
	
	context.putImageData(imageData, 0, 0);
}

function drawInEmboss() {
	var imageData, data, length, width, index = 3;
	
	imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	data = imageData.data;
	width = imageData.width;
	length = data.length;
	
	for (i = 0; i < length; i++) {
		if (i <= length - width * 4) {
			if ((i + 1) % 4 !== 0) {
				if ((i + 4) % (width * 4) === 0) {
					data[i] = data[i - 4];
					data[i + 1] = data[i - 3];
					data[i + 2] = data[i - 2];
					data[i + 3] = data[i - 1];
					
					i += 4;
				}
				else {
					data[i] = 255 / 2 + 2 * data[i] - data[i + 4] - data[i + width * 4];
				}
			}
		}
		else {
			if ((i + 1) % 4 !== 0) {
				data[i] = data[i - width * 4];
			}
		}
	}
	context.putImageData(imageData, 0, 0);
}

function drawInSunglass() {
	sunglassFilter.postMessage(
		context.getImageData(0, 0, canvas.width, canvas.height)
	);
	
	sunglassFilter.onmessage = function (event) {
		context.putImageData(event.data, 0, 0);
	};
}

function drawInColor() {
	context.drawImage(image, 0, 0, image.width, image.height, 
		0, 0, canvas.width, canvas.height);
}
	
// Event handlers

negativeButton.onclick = function () {
	drawInNegative();
};

blackWhiteButton.onclick = function (e) {
	drawInBlackAndWhite();
};

embossButton.onclick = function (e) {
	drawInEmboss();
};

sunglassButton.onclick = function (e) {
	drawInSunglass();
};

resetButton.onclick = function (e) {
	drawInColor();
};

// Initialize

image.src = "images/caisijiucheng.jpg";

image.onload = function (e) {
	drawInColor();
};
