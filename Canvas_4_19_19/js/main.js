var canvas = document.getElementById("canvas"),
	context = canvas.getContext("2d"),
	
	fadeButton = document.getElementById("fadeButton"),
	
	image = new Image(),
	
	originalImageData = null,
	interval = null;

// Functions

function increaseTransparency(imageData, steps) {
	var alpha, currentAlpha, step, i, length = imageData.data.length;
	
	for (i = 3; i < length; i += 4) {
		alpha = originalImageData.data[i];
		
		if (alpha > 0 && imageData.data[i] > 0) {
			currentAlpha = imageData.data[i];
			step = Math.ceil(alpha / steps);
			
			if (alpha - step > 0) {
				imageData.data[i] -= step;
			}
			else {
				imageData.data[i] = 0;
			}
		}
	}
}

function animationComplete() {
	setTimeout(function () {
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
	}, 1000);
}

function fadeOut(context, imageData, x, y, steps, millisecondPerStep) {
	var frame = 0,
		length = imageData.data.length;
		
	interval = setInterval(function () {
		frame++;
		
		if (frame > steps) {
			clearInterval(interval);
			animationComplete();
		}
		else {
			increaseTransparency(imageData, steps);
			context.putImageData(imageData, x, y);
		}
	}, millisecondPerStep);
}
	
// Event handlers

fadeButton.onclick = function (e) {
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	fadeOut(context, imageData, 0, 0, 20, 1000 / 60);
};

// Initialize

image.src = "images/caisijiucheng.jpg";

image.onload = function (e) {
	context.drawImage(image, 0, 0, canvas.width, canvas.height);
	originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
};
