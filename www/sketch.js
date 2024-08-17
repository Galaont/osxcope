let swipeDistance, slider, fft, mic, lp_filter, hp_filter, micLevel, minAmpThreshold, amp;
var waveform_mode, spectrum_mode, micAccessGranted = false;
let initialScreen = true;
let swipeStartX, swipeEndX;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	fft = new p5.FFT(0.75);
	amp = 2;
	frameRate(30);
	stroke(255);
	strokeWeight(2)
	angleMode(DEGREES);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function startMic() {
   micAccessGranted = true;

   mic = new p5.AudioIn();
   lp_filter = new p5.LowPass();
   hp_filter = new p5.HighPass();

   lp_filter.freq(18000)
   lp_filter.disconnect()

   hp_filter.freq(25)
   hp_filter.disconnect()

   mic.start();
}

function inputStarted() {
	swipeStartX = mouseX || touches[0]?.x || 0;
}

function inputEnded() {
	if (!micAccessGranted) startMic()
	swipeEndX = mouseX || touches[0]?.x || swipeStartX; // Handle touch and mouse
	swipeDistance = swipeEndX - swipeStartX;
	let distance_threshold = width>>4
	if (swipeDistance > distance_threshold) { // Swipe right (Spectrum mode)
		if (waveform_mode) slider.remove()
		initialScreen = false;
		waveform_mode = false;
		spectrum_mode = true;
	} else if (swipeDistance < -distance_threshold) { // Swipe left (Waveform mode)
		slider = createSlider(1, 6, 2, 0.1);
		slider.position(width*0.9, height*0.1);
		slider.size(width>>3);
		slider.style('transform', 'rotate(-90deg)');
		initialScreen = false;
		waveform_mode = true;
		spectrum_mode = false;
	}
}

mousePressed = touchStarted = inputStarted;
mouseReleased = touchEnded = inputEnded;

function showInitialScreen() {
	background(0);
	fill(255);
	textSize(constrain(((width>>6)*(height>>6))/4, 12, 64));
	textAlign(LEFT, TOP);
	text("Swipe to Right for Spectrum ->", width/16, height/16);
	textAlign(RIGHT, BOTTOM);
	text("<- Swipe to Left for Waveform", width/16*15, height/16*15);
	line (width, 0, 0, height)
}

function fft_noise_gate() {
	minAmpThreshold = 0.0025;

	micLevel = mic.getLevel();
	console.log(micLevel)
	if (micLevel > minAmpThreshold) {
		lp_filter.process(mic)
		hp_filter.process(lp_filter)
		fft.setInput(hp_filter);
	 }else{
		mic.disconnect()
	}
}

function showSpectrum() {
	fft_noise_gate()
	let spectrum = fft.analyze();
	let intensity_color = (fft.getEnergy('bass') + fft.getEnergy('lowMid') + 
						   fft.getEnergy('mid') + fft.getEnergy('highMid') + fft.getEnergy('treble'))/4
	stroke(intensity_color);
	fill(intensity_color, 255-intensity_color,0)
	beginShape();
	vertex(0, windowHeight);
	for (let i = 0; i < spectrum.length; i++) {
		let x = map(i, 0, spectrum.length, 0, width);
		let y = map(spectrum[i], 0, 255, height, 0);
		vertex(x, y);
	}
	vertex(width, windowHeight);
	endShape();
	//console.log(spectrum)
}

function showWaveform() {
	fft_noise_gate()
	amp = slider.value()
	waveform = fft.waveform();
	let minIndex = waveform.indexOf(Math.min(...waveform));
	waveform = waveform.slice(minIndex).concat(waveform.slice(0, minIndex));
	stroke(255);
	noFill()
	beginShape();
	for (let i = 0; i < waveform.length; i++) {
		let x = map(i, 0, waveform.length, 0, width);
		let y = map(waveform[i], -1/amp, 1/amp, height, 0);
		vertex(x, y);
	}
	endShape();
	//console.log(waveform)
}

function draw() {
	background(0);
	if (initialScreen) {
		showInitialScreen();
	} else if (spectrum_mode) {
		showSpectrum()
	}else if (waveform_mode) {
		showWaveform()
	}
}