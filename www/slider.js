class Slider {
    constructor(width, height, roundness, initialAmp) {
        this.updateDimensions(width, height); // Initialize positions and dimensions
        this.roundness = roundness;
        this.initialAmp = initialAmp;
        this.isVisible = false;
        this.opacity = 0;
        this.lastActiveTime = 0;
        this.dragging = false;
        this.updatePositionFromAmp(initialAmp);
    }

    updateDimensions(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
        this.sliderX = this.width * 31 / 32;
        this.sliderYStart = this.height / 8;
        this.sliderYEnd = this.height - this.sliderYStart;

        this.rectWidth = this.width / 32;
        this.rectHeight = this.height / 8;
        this.rectX = this.sliderX - this.rectWidth / 2;
    }

    updatePositionFromAmp(amp) {
        this.currentY = map(amp, 0.1, 3, this.sliderYEnd - this.rectHeight / 2, this.sliderYStart + this.rectHeight / 2);
    }

    show() {
        if (!waveform_mode || !this.isVisible) return;

        const timeSinceLastActive = millis() - this.lastActiveTime;
        if (timeSinceLastActive > 2000) {
            this.opacity = max(0, this.opacity - 10);
            if (this.opacity === 0) this.isVisible = false;
        } else {
            this.opacity = min(255, this.opacity + 50);
        }

        push();
        stroke(255, this.opacity);
        strokeWeight(2);
        line(this.sliderX, this.sliderYStart, this.sliderX, this.sliderYEnd);

        fill(255, this.opacity);
        rect(this.rectX, this.currentY - this.rectHeight / 2, this.rectWidth, this.rectHeight, this.roundness
        );
        pop();
    }

    handleInput() {
        if (!this.dragging) return;

        const currentY = mouseY || touches[0]?.y || this.sliderYStart;
        this.currentY = constrain(
            currentY,
            this.sliderYStart + this.rectHeight / 2,
            this.sliderYEnd - this.rectHeight / 2
        );

        amp = map( this.currentY, this.sliderYEnd - this.rectHeight / 2, this.sliderYStart + this.rectHeight / 2, 0.1, 3);
        this.lastActiveTime = millis();
    }

    checkIfDragging() {
        if (!waveform_mode) return false;

        if (mouseX > this.width * 30 / 32 || touches[0]?.x > this.width * 30 / 32) {
            this.isVisible = true;
            this.lastActiveTime = millis();
        }

        if (this.isVisible) {
            const xInRange = mouseX >= this.rectX && mouseX <= this.rectX + this.rectWidth;
            const yInRange = mouseY >= this.currentY - this.rectHeight / 2 && mouseY <= this.currentY + this.rectHeight / 2;

            if (xInRange && yInRange) {
                this.dragging = true;
                this.offsetY = this.currentY - (mouseY || touches[0]?.y || this.currentY);
            }
        }
        return this.dragging;
    }

    stopDragging() {
        this.dragging = false;
    }
}