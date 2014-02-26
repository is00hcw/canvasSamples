var canvas = document.getElementById("canvas"),
	context = canvas.getContext("2d"),
	
	offscreenCanvas = document.createElement("canvas"),
	offscreenContext = offscreenCanvas.getContext("2d"),
	
	image = new Image(),
	
	scaleSlider = document.getElementById("scaleSlider"),
	scaleOutput = document.getElementById("scaleOutput"),
	scale = 1.0,
	MINIMUM_SCALE = 1.0,
	MAXIMUM_SCALE = 3.0;
	
// Functions

function drawScaled() {
	var width = canvas.width,
		height = canvas.height,
		scaleWidth = width * scale,
		scaleHeight = height * scale;
	
	context.drawImage(offscreenCanvas, 0, 0, 
		offscreenCanvas.width, offscreenCanvas.height, 
		-scaleWidth / 2 + width / 2, -scaleHeight / 2 + height / 2, 
		scaleWidth, scaleHeight);
}

function drawScaleText(value) {
	var text = parseFloat(value).toFixed(2);
	var percent = parseFloat(value - MINIMUM_SCALE) / 
		parseFloat(MAXIMUM_SCALE - MINIMUM_SCALE);
		
	scaleOutput.innerText = text;
	percent = percent < 0.35 ? 0.35 : percent;
	scaleOutput.style.fontSize = percent * MAXIMUM_SCALE / 1.5 + "em";
}

function drawWatermark(context) {
	var lineOne = "Copyright",
		lineTwo = "witun Inc.",
		textMetrics = null,
		FONT_HEIGHT = 128;
	
	context.save();
	
	context.fillStyle = "rgba(100, 140, 230, 0.5)";
	context.strokeStyle = "yellow";
	context.shadowColor = "rgba(50, 50, 50, 1.0)";
	context.shadowOffsetX = 5;
	context.shadowOffsetY = 5;
	context.shadowBlue = 10;
	
	context.font = FONT_HEIGHT + 'px Arial';
	textMetrics = context.measureText(lineOne);
	context.translate(canvas.width / 2, canvas.height / 2);
	context.fillText(lineOne, -textMetrics.width / 2, 0);
	context.strokeText(lineOne, -textMetrics.width / 2, 0);	
	
	textMetrics = context.measureText(lineTwo);
	context.fillText(lineTwo, -textMetrics.width / 2, FONT_HEIGHT);
	context.strokeText(lineTwo, -textMetrics.width / 2, FONT_HEIGHT);	
	
	context.restore();
}

// Event handlers

scaleSlider.onchange = function (e) {
	scale = e.target.value;
	
	if (scale < MINIMUM_SCALE) {
		scale = MINIMUM_SCALE;
	}
	else if (scale > MAXIMUM_SCALE) {
		scale = MAXIMUM_SCALE;
	}
	
	drawScaleText(scale);
	drawScaled();
};

// Initialization

offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

image.src = "images/sijiucheng.jpg";

image.onload = function (e) {
	context.drawImage(image, 0, 0, canvas.width, canvas.height);
	offscreenContext.drawImage(image, 0, 0, canvas.width, canvas.height);
	
	drawWatermark(context);
	drawWatermark(offscreenContext);
	
	drawScaleText(scaleSlider.value);
};
