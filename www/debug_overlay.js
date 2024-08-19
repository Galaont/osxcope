function displayDebugOverlay(){
    if (waveform_mode){
        textSize(constrain(((width>>6)*(height>>6))/4, 12, 64));
        textAlign(LEFT, TOP);
        text("height: " + height + " | width: " + width, width/16, height/16);
        textSize(constrain(((width>>6)*(height>>6))/4, 12, 64));
        textAlign(LEFT, TOP);
        text("input level: " + mic.getLevel().toPrecision(4), width/16, height/16*2);
        textSize(constrain(((width>>6)*(height>>6))/4, 12, 64));
        textAlign(LEFT, TOP);
        text("Is mobile: " + isMobile(), width/16, height/16*3);

        textSize(constrain(((width>>6)*(height>>6))/4, 12, 64));
        textAlign(RIGHT, TOP);
        text('Device Pixel Ratio:' + window.devicePixelRatio, width/16*15, height/16);
        textSize(constrain(((width>>6)*(height>>6))/4, 12, 64));
        textAlign(RIGHT, TOP);
        text("Amp: " + parseFloat((amp).toPrecision(4)), width/16*15, height/16*2);
        textSize(constrain(((width>>6)*(height>>6))/4, 12, 64));
        textAlign(RIGHT, TOP);
        text("Distinct waveform values: " + distinctCount, width/16*15, height/16*3);        
        textSize(constrain(((width>>6)*(height>>6))/4, 12, 64));
        textAlign(RIGHT, TOP);
        text("Waveform length: " + waveform.length, width/16*15, height/16*4);
    }
}