let fft, amp, bins;
let waveform_mode, spectrum_mode, micAccessGranted = false;
let initialScreen = true;
let distinctCount = 0

function setup() {
	createCanvas(windowWidth, windowHeight);
	//pixelDensity(window.devicePixelRatio);
	//pixelDensity(1)
	background(0);
	//bins=1024
	fft = new p5.FFT();
	//fft = new p5.AnalyzerFFT()
	amp = 2
	frameRate(30);
	stroke(255);
	strokeWeight(2)
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
    fft_noise_gate();
	waveform = fft.waveform(bins);
	waveform = waveform.map(value => float(value * mobileMultiplier)*amp);
	distinctCount = new Set(waveform).size;

	displayDebugOverlay()
    // Limit the search to the first quarter of the waveform array
    let quarterLength = Math.floor(waveform.length * 0.5);
    let minIndex = waveform.slice(0, quarterLength).indexOf(Math.min(...waveform.slice(0, quarterLength)));

    // Align the waveform based on the calculated minimum index
    waveform = waveform.slice(minIndex).concat(waveform.slice(1, minIndex));

    stroke(255);
    noFill();
    beginShape();
    
    // Interpolation settings
    let resolution = 2; // Increase this value for smoother curves by adding intermediate points
    for (let i = 0; i < waveform.length - 1; i += 2) {
        let x1 = map(i, 0, waveform.length, 0, width * 2);
        let y1 = height / 2;
        let y_offset1 = map(waveform[i], -1, 1, -height / amp, height / amp);
        y1 = float(y1 - y_offset1);

        let x2 = map(i + 2, 0, waveform.length, 0, width * 2);
        let y2 = height / 2;
        let y_offset2 = map(waveform[i + 2], -1, 1, -height / amp, height / amp);
        y2 = float(y2 - y_offset2);

        // Draw more points between each pair of vertices using interpolation
        for (let j = 0; j < resolution; j++) {
            let interX = lerp(x1, x2, j / resolution);
            let interY = lerp(y1, y2, j / resolution);
            vertex(interX, interY);
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
		stroke(255);
		strokeWeight(2);
		noFill();

		showWaveform()
	}
}