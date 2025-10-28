import * as THREE from 'three';

export class MouseTracker {
  constructor(camera, eyeballGroup, eyeball) {
    this.camera = camera;
    this.eyeballGroup = eyeballGroup;
    this.eyeball = eyeball;

    // Mouse position in normalized device coordinates (-1 to +1)
    this.mouse = new THREE.Vector2();

    // Target rotation
    this.targetRotation = new THREE.Euler();

    // Current rotation (for smooth interpolation)
    this.currentRotation = new THREE.Euler();

    // Maximum rotation angles (in radians) for realistic movement
    this.maxRotationX = Math.PI / 6; // 30 degrees
    this.maxRotationY = Math.PI / 6; // 30 degrees

    // Smoothing factor (lower = smoother)
    this.smoothness = 0.1;

    // Pupil size parameters
    this.maxPupilScale = 1.5; // 50% increase when mouse is at center
    this.currentPupilSize = this.eyeball.params.pupilSize;
    this.targetPupilSize = this.eyeball.params.pupilSize;

    // Eye direction tracking
    this.eyeDirection = new THREE.Vector3(0, 0, 1);

    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('mousemove', (event) => {
      // Convert to normalized device coordinates
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Calculate target rotation based on mouse position
      // Y rotation follows horizontal mouse movement
      // X rotation follows vertical mouse movement (inverted)
      this.targetRotation.y = this.mouse.x * this.maxRotationY;
      this.targetRotation.x = -this.mouse.y * this.maxRotationX;

      // Calculate distance from center (0,0) to mouse position
      const distanceFromCenter = Math.sqrt(
        this.mouse.x * this.mouse.x + this.mouse.y * this.mouse.y
      );

      // Normalize distance (max distance to corner is sqrt(2) ≈ 1.414)
      const maxDistance = Math.sqrt(2);
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);

      // Calculate pupil size: larger when close (distance = 0), normal when far (distance = 1)
      // Use inverse relationship: (1 - distance)
      // Use the base pupil size from eyeball params so control panel changes are respected
      const proximityFactor = 1 - normalizedDistance;
      const scaleMultiplier = 1 + (this.maxPupilScale - 1) * proximityFactor;
      this.targetPupilSize = this.eyeball.params.pupilSize * scaleMultiplier;
    });
  }

  update() {
    // Smoothly interpolate current rotation towards target rotation
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.smoothness;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.smoothness;

    // Apply rotation to eyeball group
    this.eyeballGroup.rotation.x = this.currentRotation.x;
    this.eyeballGroup.rotation.y = this.currentRotation.y;

    // Calculate eye direction from current rotation
    // Start with forward vector (0, 0, 1) and apply rotation
    this.eyeDirection.set(0, 0, 1);
    this.eyeDirection.applyEuler(this.currentRotation);

    // Smoothly interpolate pupil size
    this.currentPupilSize += (this.targetPupilSize - this.currentPupilSize) * this.smoothness;

    // Apply updates to eyeball shader
    if (this.eyeball) {
      this.eyeball.updateParam('uPupilSize', this.currentPupilSize);
      this.eyeball.material.uniforms.uEyeDirection.value.copy(this.eyeDirection);
    }
  }
}
