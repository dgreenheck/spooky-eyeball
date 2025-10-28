export class SoundManager {
    constructor() {
        this.ambientSound = null;
        this.squishSound = null;
        this.initialized = false;
    }

    async init() {
        try {
            // Use BASE_URL to handle both local and production environments
            const baseUrl = import.meta.env.BASE_URL;

            // Load ambient sound
            this.ambientSound = new Audio(`${baseUrl}sounds/ambient.mp3`);
            this.ambientSound.loop = true;
            this.ambientSound.volume = 0.3;

            // Load squish sound
            this.squishSound = new Audio(`${baseUrl}sounds/squish.mp3`);
            this.squishSound.volume = 0.5;

            this.initialized = true;
            console.log('SoundManager initialized');
        } catch (error) {
            console.warn('Could not load audio files:', error);
            console.log('Please add audio files to public/sounds/ directory');
        }
    }

    playAmbient() {
        if (this.ambientSound && this.initialized) {
            // Modern browsers require user interaction before playing audio
            this.ambientSound.play().catch(err => {
                console.log('Ambient sound autoplay prevented. Click anywhere to start audio.');
            });
        }
    }

    playSquish() {
        if (this.squishSound && this.initialized) {
            // Reset and play
            this.squishSound.currentTime = 0;
            this.squishSound.play().catch(err => {
                console.log('Could not play squish sound:', err);
            });
        }
    }

    stopAmbient() {
        if (this.ambientSound) {
            this.ambientSound.pause();
            this.ambientSound.currentTime = 0;
        }
    }

    // Enable audio on first user interaction
    enableAudioOnInteraction() {
        const enableAudio = () => {
            this.playAmbient();
            window.removeEventListener('click', enableAudio);
            window.removeEventListener('touchstart', enableAudio);
        };

        window.addEventListener('click', enableAudio, { once: true });
        window.addEventListener('touchstart', enableAudio, { once: true });
    }
}
