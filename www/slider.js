class Slider {
    constructor(startX, startY, width, height, roundness, initialAmp) {
        this.slider_line = {
            startX: startX,
            startY: startY,
            end_y: height - (height / 8),
        };
        this.slider_rect = {
            startX: startX - (width / 64),
            width: width / 32,
            height: height / 8,
            roundness: roundness,
        };
        this.dragging = false;
        this.isVisible = false;
        this.opacity = 0; // Start fully transparent
        this.lastActiveTime = 0; // Track the last interaction time
        
        // Initialize the slider position based on the amp value
        this.currentY = map(initialAmp, 0.1, 10, this.slider_line.end_y - (this.slider_rect.height / 2), this.slider_line.startY + (this.slider_rect.height / 2));
        this.offsetY = 0;
    }

    show() {
        if (!waveform_mode) return; // Only show the slider in waveform mode
        
        if (this.isVisible) {
            // Handle fading based on inactivity
            let timeSinceLastActive = millis() - this.lastActiveTime;
            if (timeSinceLastActive > 2000) { // 2 seconds of inactivity
                this.opacity = max(0, this.opacity - 10); // Fade out gradually
                if (this.opacity === 0) this.isVisible = false;
            } else {
                this.opacity = min(255, this.opacity + 50); // Fade in quickly
            }
            
            // Save the current drawing state
            push();
            
            // Apply opacity to the line
            stroke(255, this.opacity);
            strokeWeight(2); // Adjust stroke weight if needed
            line(this.slider_line.startX, this.slider_line.startY, this.slider_line.startX, this.slider_line.end_y);
            
            // Apply opacity to the rectangle outline and fill
            noFill(); // Set fill to none for the outline
            stroke(255, this.opacity); // Outline color with opacity
            strokeWeight(2); // Adjust stroke weight if needed
            rect(this.slider_rect.startX, this.currentY - (this.slider_rect.height / 2), this.slider_rect.width, this.slider_rect.height, this.slider_rect.roundness); // Draw outline
            
            fill(255, this.opacity); // Fill color with opacity
            noStroke(); // Remove stroke for the fill
            rect(this.slider_rect.startX, this.currentY - (this.slider_rect.height / 2), this.slider_rect.width, this.slider_rect.height, this.slider_rect.roundness); // Draw fill
            
            // Restore the previous drawing state
            pop();
        }
    }

    handleInput() {
        if (this.dragging) {
            let currentY = mouseY || touches[0]?.y || this.slider_line.startY;
            this.currentY = constrain(
                currentY + this.offsetY,
                this.slider_line.startY + (this.slider_rect.height / 2), // Lower bound based on center
                this.slider_line.end_y - (this.slider_rect.height / 2) // Upper bound based on center
            );
            amp = map(this.currentY, this.slider_line.end_y - (this.slider_rect.height / 2), this.slider_line.startY + (this.slider_rect.height / 2), 0.1, 10);
            this.lastActiveTime = millis(); // Update the activity timestamp
        }
    }

    checkIfDragging() {
        if (!waveform_mode) return false;
        
        // Check if user clicked/touched the rightmost section of the screen
        if (mouseX > width * 30 / 32 || touches[0]?.x > width * 30 / 32) {
            this.isVisible = true; // Show the slider
            this.lastActiveTime = millis(); // Reset the inactivity timer
        }
        
        if (this.isVisible) {
            let xInRange = mouseX >= this.slider_rect.startX && mouseX <= this.slider_rect.startX + this.slider_rect.width;
            let yInRange = mouseY >= this.currentY - (this.slider_rect.height / 2) && mouseY <= this.currentY + (this.slider_rect.height / 2);

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
