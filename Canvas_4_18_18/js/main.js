var canvas = document.getElementById("canvas"),
	context = canvas.getContext("2d"),
	
	offscreenCanvas = document.createElement("canvas"),
	offscreenContext = offscreenCanvas.getContext("2d"),
	
	sunglassButton = document.getElementById("sunglassButton"),
	resetButton = document.getElementById("resetButton"),
	
	image = new Image(),
	
	sunglassFilter = new Worker("js/sunglassFilter.js"),
	
	LENS_RADIUS = canvas.width / 5;

// Functions

function drawLensens(leftLensLocation, rightLensLocation) {
	context.save();
	
	context.beginPath();
	
	context.arc(leftLensLocation.x, leftLensLocation.y, LENS_RADIUS, 0, 
		Math.PI * 2, false);
	context.stroke();
	
	context.moveTo(rightLensLocation.x, rightLensLocation.y);
	
	context.arc(rightLensLocation.x, rightLensLocation.y, LENS_RADIUS, 0, 
		Math.PI * 2, false);
	context.stroke();
	
	context.clip();
	context.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
	context.restore();
}

function drawWire(center) {
	context.beginPath();
	
	context.moveTo(center.x - LENS_RADIUS / 4, center.y - LENS_RADIUS / 2);
	
	context.quadraticCurveTo(center.x, center.y - LENS_RADIUS + 20,
		center.x + LENS_RADIUS / 4, center.y - LENS_RADIUS / 2);
	
	context.stroke();
}

function drawConnectors(center) {
	context.beginPath();
	
	context.fillStyle = "silver";
	context.strokeStyle = "rgba(0, 0, 0, 0.4)";
	context.lineWidth = 2;
	
	context.arc(center.x - LENS_RADIUS / 4, center.y - LENS_RADIUS / 2,
		4, 0, Math.PI * 2, false);
	context.fill();
	context.stroke();
	
	context.beginPath();
	
	context.arc(center.x + LENS_RADIUS / 4, center.y - LENS_RADIUS / 2,
		4, 0, Math.PI * 2, false);
	context.fill();
	context.stroke();
}

function drawInSunglass() {
	var imageData,
		center = {
			x: canvas.width / 2,
			y: canvas.height / 2
		},
		leftLensLocation = {
			x: center.x - LENS_RADIUS - 10,
			y: center.y
		},
		rightLensLocation = {
			x: center.x + LENS_RADIUS + 10,
			y: center.y
		};
		
	imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	sunglassFilter.postMessage(imageData);
	
	sunglassFilter.onmessage = function (event) {
		offscreenContext.putImageData(event.data, 0, 0);
		drawLensens(leftLensLocation, rightLensLocation);
		drawWire(center);
		drawConnectors(center);
	};
}

function drawInColor() {
	context.drawImage(image, 0, 0, image.width, image.height, 
		0, 0, canvas.width, canvas.height);
}
	
// Event handlers

sunglassButton.onclick = function (e) {
	drawInSunglass();
};

resetButton.onclick = function (e) {
	drawInColor();
};

// Initialize

offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

image.src = "images/caisijiucheng.jpg";

image.onload = function (e) {
	drawInColor();
};
