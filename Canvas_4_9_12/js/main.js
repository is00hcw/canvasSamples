var canvas = document.getElementById("canvas"),
	context = canvas.getContext("2d"),
	
	resetButton = document.getElementById("resetButton"),
	
	image = new Image(),
	imageData,
	imageDataCopy = context.createImageData(canvas.width, canvas.height),
	
	mousedown = {},
	rubberbandRectangle = {},
	dragging = false;
	
// Functions

function windowToCanvas(canvas, x, y) {
	var canvasRectangle = canvas.getBoundingClientRect();
	
	return {
		x: x - canvasRectangle.left,
		y: y - canvasRectangle.top
	};
}

function copyCanvasPixels() {
	var i = 0;
	
	// Copy red, green, and blue components of the first pixel
	for (i = 0; i < 3; i++) {
		imageDataCopy.data[i] = imageData.data[i];
	}
	
	//
	for (i = 3; i < imageData.data.length - 4; i += 4) {
		imageDataCopy.data[i] = imageData.data[i] / 2; //Alpha
		imageDataCopy.data[i + 1] = imageData.data[i + 1]; //Red
		imageDataCopy.data[i + 2] = imageData.data[i + 2]; //Green
		imageDataCopy.data[i + 3] = imageData.data[i + 3]; //Blue
	}
}

function captureRubberbandPixels() {
	/*imageData = context.getImageData(rubberbandRectangle.left, 
		rubberbandRectangle.top,
		rubberbandRectangle.width,
		rubberbandRectangle.height);*/
	
	imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	copyCanvasPixels();
}

function restoreRubberbandPixels() {
	/*context.putImageData(imageData, rubberbandRectangle.left, 
		rubberbandRectangle.top);*/
		
	var deviceWidthOverCSSPixels = imageData.width / canvas.width,
		deviceHeightOverCSSPixels = imageData.height / canvas.height;
	
	context.putImageData(imageData, 0, 0);		
		
	context.putImageData(imageDataCopy, 0, 0, 
		rubberbandRectangle.left + context.lineWidth, 
		rubberbandRectangle.top + context.lineWidth,
		(rubberbandRectangle.width - 2 * context.lineWidth) * deviceWidthOverCSSPixels,
		(rubberbandRectangle.height - 2 * context.lineWidth) * deviceHeightOverCSSPixels);	
}

function drawRubberband() {
	context.strokeRect(rubberbandRectangle.left + context.lineWidth,
		rubberbandRectangle.top + context.lineWidth,
		rubberbandRectangle.width - 2 * context.lineWidth,
		rubberbandRectangle.height - 2 * context.lineWidth);
}

function setRubberbandRectangle(x, y) {
	rubberbandRectangle.left = Math.min(x, mousedown.x);
	rubberbandRectangle.top = Math.min(y, mousedown.y);
	rubberbandRectangle.width = Math.abs(x - mousedown.x);
	rubberbandRectangle.height = Math.abs(y - mousedown.y);
}

function updateRubberband() {
	captureRubberbandPixels();
	drawRubberband();
}

function rubberbandStart(x, y) {
	mousedown.x = x;
	mousedown.y = y;
	
	rubberbandRectangle.left = mousedown.x;
	rubberbandRectangle.top = mousedown.y;
	rubberbandRectangle.width = 0;
	rubberbandRectangle.height = 0;
	
	dragging = true;
	
	captureRubberbandPixels();
}

function rubberbandStretch(x, y) {
	// prevent zero width and height rectangle
	if (rubberbandRectangle.width > 2 * context.lineWidth && 
		rubberbandRectangle.height > 2 * context.lineWidth) {
		if (imageData !== undefined) {
			restoreRubberbandPixels();
		}
	}
	
	setRubberbandRectangle(x, y);
	
	// prevent zero width and height rectangle
	if (rubberbandRectangle.width > 2 * context.lineWidth && 
		rubberbandRectangle.height > 2 * context.lineWidth) {
		//updateRubberband();
		drawRubberband();
	}
}

function rubberbandEnd() {
	context.putImageData(imageData, 0, 0);

	context.drawImage(canvas, 
		rubberbandRectangle.left + context.lineWidth * 2,
		rubberbandRectangle.top + context.lineWidth * 2,
		rubberbandRectangle.width - 4 * context.lineWidth,
		rubberbandRectangle.height - 4 * context.lineWidth,
		0, 0, canvas.width, canvas.height);
		
	dragging = false;
	imageData = undefined;
}
	
// Event handlers

canvas.onmousedown = function (e) {
	var loc = windowToCanvas(canvas, e.clientX, e.clientY);
	//e.preventDefault();
	rubberbandStart(loc.x, loc.y);
};

canvas.onmousemove = function (e) {
	var loc;
	
	if (dragging) {
		loc = windowToCanvas(canvas, e.clientX, e.clientY);
		rubberbandStretch(loc.x, loc.y);
	}
};

canvas.onmouseup = function (e) {
	rubberbandEnd();
};
	
// Initialize

image.src = "images/sijiucheng.jpg";

image.onload = function (e) {
	context.drawImage(image, 0, 0, canvas.width, canvas.height);
};

resetButton.onclick = function (e) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

context.strokeStyle = "navy";
context.lineWidth = 1.0;
