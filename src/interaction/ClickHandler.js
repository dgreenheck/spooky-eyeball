import * as THREE from 'three';

export class ClickHandler {
    constructor(camera, eyeballMesh, soundManager) {
        this.camera = camera;
        this.eyeballMesh = eyeballMesh;
        this.soundManager = soundManager;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Jiggle animation state
        this.isJiggling = false;
        this.jiggleTime = 0;
        this.jiggleDuration = 0.5; // seconds
        this.jiggleIntensity = 0.15;
        this.jiggleFrequency = 20;

        // Store original scale
        this.originalScale = this.eyeballMesh.scale.clone();

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('click', (event) => {
            // Convert mouse position to normalized device coordinates
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update raycaster
            this.raycaster.setFromCamera(this.mouse, this.camera);

            // Check for intersection with eyeball
            const intersects = this.raycaster.intersectObject(this.eyeballMesh);

            if (intersects.length > 0) {
                this.triggerJiggle();
            }
        });
    }

    triggerJiggle() {
        // Start jiggle animation
        this.isJiggling = true;
        this.jiggleTime = 0;

        // Play squish sound
        this.soundManager.playSquish();
    }

    update(deltaTime) {
        if (!this.isJiggling) return;

        this.jiggleTime += deltaTime;

        if (this.jiggleTime < this.jiggleDuration) {
            // Calculate jiggle with decay
            const progress = this.jiggleTime / this.jiggleDuration;
            const decay = 1.0 - progress;

            // Oscillating jiggle using sine waves
            const jiggleX = Math.sin(this.jiggleTime * this.jiggleFrequency) * this.jiggleIntensity * decay;
            const jiggleY = Math.sin(this.jiggleTime * this.jiggleFrequency * 1.3) * this.jiggleIntensity * decay;
            const jiggleZ = Math.sin(this.jiggleTime * this.jiggleFrequency * 0.8) * this.jiggleIntensity * decay;

            // Apply scale deformation
            this.eyeballMesh.scale.set(
                this.originalScale.x + jiggleX,
                this.originalScale.y + jiggleY,
                this.originalScale.z + jiggleZ
            );
        } else {
            // End jiggle, reset scale
            this.isJiggling = false;
            this.eyeballMesh.scale.copy(this.originalScale);
        }
    }
}
