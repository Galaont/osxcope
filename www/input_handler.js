let swipeStartX, swipeEndX, swipeDistanceX, swipeStartY;
const mobileMultiplier = isMobile() ? 10 : 1;

function isMobile() {
    // Use a combination of touch support, user-agent checks, and platform checks
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileUserAgent = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Check for specific desktop OS platforms that might still have touch support
    const isDesktopPlatform = /MacIntel|Win32|Win64|Linux x86_64/i.test(navigator.platform);

    // Return true only if it's not a desktop platform, and both touch support and a mobile user-agent are detected
    return isTouchDevice && isMobileUserAgent && !isDesktopPlatform;
}


function inputStarted() {
	swipeStartX = mouseX || touches[0]?.x || 0;
	swipeStartY = mouseY || touches[0]?.y || 0;
}

// Real-time amp control during drag
function inputMoved() {

	if (waveform_mode){
    	let currentY = mouseY || touches[0]?.y || swipeStartY;
    	let deltaY = swipeStartY - currentY;
		amp = constrain(amp + (deltaY*0.05), 0.1, 10); // Adjust sensitivity as needed
    	swipeStartY = currentY; // Update start Y for smooth continuous adjustment
    	console.log(deltaY)
	}
}

function inputEnded() {
	if (!micAccessGranted) startMic()
	swipeEndX = mouseX || touches[0]?.x || swipeStartX; // Handle touch and mouse
	swipeDistanceX = swipeEndX - swipeStartX;
	let xDistanceThreshold = width>>2
	if (swipeDistanceX > xDistanceThreshold) { // Swipe right (Spectrum mode)
		initialScreen = false;
		waveform_mode = false;
		spectrum_mode = true;
	} else if (swipeDistanceX < -xDistanceThreshold) { // Swipe left (Waveform mode)
		initialScreen = false;
		waveform_mode = true;
		spectrum_mode = false;
	}
	console.log(swipeDistanceX)
}

// Event bindings for both desktop and mobile
mousePressed = touchStarted = inputStarted;
mouseReleased = touchEnded = inputEnded;
mouseDragged = touchMoved = inputMoved;