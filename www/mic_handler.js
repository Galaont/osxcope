let mic, lp_filter, hp_filter, micLevel, minAmpThreshold;

function startMic() {
    micAccessGranted = true;
 
    mic = new p5.AudioIn();
 
    lp_filter = new p5.LowPass();
    hp_filter = new p5.HighPass();
    lp_filter.freq(18000)
    lp_filter.disconnect()
    hp_filter.freq(25)
    hp_filter.disconnect()
 
	for (let i = 0; i<(mobileMultiplier);i++){
		mic.start()
	}
 }
 
 function fft_noise_gate() {
	minAmpThreshold = 0.0096 / (mobileMultiplier);

	micLevel = mic.getLevel();
	//console.log(micLevel)
	if (micLevel > minAmpThreshold) {
		lp_filter.process(mic)
		hp_filter.process(lp_filter)
		fft.setInput(hp_filter);
	 }else{
		mic.disconnect()
	}
}