let fft, amp, bins, slider;
let waveform_mode, spectrum_mode, micAccessGranted, anchor_toggle = false;
let initialScreen = true;
let distinctCount = 0

function setup() {
    createCanvas(windowWidth, windowHeight);
    amp = 1;
    slider = new Slider(windowWidth, windowHeight, 1, amp);
    background(0);
    fft = new p5.FFT(0.1, 2048);
    frameRate(30);
    stroke(255);
    strokeWeight(2);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    slider.updateDimensions(windowWidth, windowHeight);
    slider.updatePositionFromAmp(amp);
    background(0); // Clear the background
}

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
    slider.handleInput();
    slider.show();
    fft_noise_gate();
    waveform = fft.waveform(bins);
    distinctCount = new Set(waveform).size;

    displayDebugOverlay();

    if (anchor_toggle) {
        // Limit the search to the first quarter of the waveform array
        let quarterLength = Math.floor(waveform.length * 0.5);
        let minIndex = waveform.slice(0, quarterLength).indexOf(Math.min(...waveform.slice(0, quarterLength)));

        // Align the waveform based on the calculated minimum index
        waveform = waveform.slice(minIndex).concat(waveform.slice(1, minIndex));
    }

    beginShape();
    for (let i = 0; i < waveform.length - 2; i += 2) {
        let x1 = map(i, 0, waveform.length, 0, width * 2);
        let y1 = height / 2;
        // Corrected y_offset1 calculation:
        let y_offset1 = map(waveform[i], -1, 1, -amp * height / 2, amp * height / 2);
        y1 -= y_offset1;
        vertex(x1, y1);
    }
    endShape();
}


function draw() {
	background(0);
	if (initialScreen) {
		showInitialScreen();
	} else if (spectrum_mode) {
		showSpectrum()
	}else if (waveform_mode) {
		stroke(255);
		strokeWeight(2.4);
		noFill();
		showWaveform()
	}
}