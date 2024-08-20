let swipeStartX, swipeEndX, swipeDistanceX, swipeStartY, swipeEndY, swipeDistanceY;
let debugOverlayVisible = false; // Track visibility of debug overlay
const mobileMultiplier = isMobile() ? 32 : 2;

function isMobile() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileUserAgent = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isDesktopPlatform = /MacIntel|Win32|Win64|Linux x86_64/i.test(navigator.platform);
    return isTouchDevice && isMobileUserAgent && !isDesktopPlatform;
}

function inputStarted() {
	swipeStartX = mouseX || touches[0]?.x || 0;
	swipeStartY = mouseY || touches[0]?.y || 0;
	if (slider.checkIfDragging()) return; // Prevent swipe detection if dragging slider
}


function inputEnded() {
	if (slider.dragging) {
		slider.stopDragging(); // Stop dragging if the slider was being adjusted
		return;
	  }
	if (!micAccessGranted) startMic()

	swipeEndX = mouseX || touches[0]?.x || swipeStartX;
    swipeEndY = mouseY || touches[0]?.y || swipeStartY;
    swipeDistanceX = swipeEndX - swipeStartX;
    swipeDistanceY = swipeEndY - swipeStartY;
	let xDistanceThreshold = width/4
	let yDistanceThreshold = height/3;
    if (Math.abs(swipeDistanceY) > yDistanceThreshold) {
        if (swipeDistanceY > 0) { // Swipe up
            debugOverlayVisible = true;
        } else if (swipeDistanceY < 0) { // Swipe down
            debugOverlayVisible = false;
        }
    }
	if (swipeDistanceX > xDistanceThreshold) { // Swipe right (Spectrum mode)
		initialScreen = false;
		waveform_mode = false;
		spectrum_mode = true;
	} else if (swipeDistanceX < -xDistanceThreshold) { // Swipe left (Waveform mode)
		if (waveform_mode) anchor_toggle = !anchor_toggle
		initialScreen = false;
		waveform_mode = true;
		spectrum_mode = false;
	}
}

// Event bindings for both desktop and mobile
mousePressed = touchStarted = inputStarted;
mouseReleased = touchEnded = inputEnded;
