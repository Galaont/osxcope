let fft, amp, bins;
let waveform_mode, spectrum_mode, micAccessGranted = false;
let initialScreen = true;
let distinctCount = 0

function setup() {
	createCanvas(windowWidth, windowHeight);
	//pixelDensity(window.devicePixelRatio);
	pixelDensity(1)
	background(0);
	bins=8192
	fft = new p5.FFT(0.7, bins);
	//fft = new p5.AnalyzerFFT()
	amp = 2
	frameRate(30);
	stroke(255);
	strokeWeight(2)
	angleMode(DEGREES);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
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
	let intensity_color = (fft.getEnergy('bass') + fft.gpigetEnergy('lowMid') + 
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
    fft_noise_gate();
    waveform = fft.waveform(bins);

	waveform = waveform.map(value => float(value * mobileMultiplier));
    distinctCount = new Set(waveform).size;

    displayDebugOverlay();

    const pixelRatio = window.devicePixelRatio || 1;

    // Apply scaling directly to the waveform array

    // Limit the search to the first 20% of the waveform array
    let quarterLength = Math.floor(waveform.length * 0.2);
    let minIndex = 0;
    let minValue = waveform[0];
    for (let i = 1; i < quarterLength; i++) {
        if (waveform[i] < minValue) {
            minValue = waveform[i];
            minIndex = i;
        }
    }
    waveform = waveform.slice(minIndex).concat(waveform.slice(0, minIndex));

    stroke(255);
    noFill();
    beginShape();

    let resolution = 4
    let yCenter = height / 2;

    for (let i = 0; i < waveform.length - 3; i += 4) {
        let x1 = (i / waveform.length) * width * 1.25; // Direct calculation for x1
        let y1 = yCenter - ((waveform[i] * height / 2) * amp);

        let x2 = ((i + 1) / waveform.length) * width * 1.25; // Direct calculation for x2
        let y2 = yCenter - ((waveform[i + 1] * height / 2) * amp);

        for (let j = 0; j <= resolution; j++) {
            let interX = lerp(x1, x2, j);
            let interY = lerp(y1, y2, j);
            curveVertex(interX, interY);
        }
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
		showWaveform()
	}
}