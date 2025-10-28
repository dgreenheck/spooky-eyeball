import * as THREE from 'three';
import { Eyeball } from './eyeball/Eyeball.js';
import { TweakpaneControls } from './controls/TweakpaneControls.js';
import { MouseTracker } from './interaction/MouseTracker.js';
import { ClickHandler } from './interaction/ClickHandler.js';
import { SoundManager } from './audio/SoundManager.js';
import './style.css';

class SpookyEyeballApp {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.eyeball = null;
    this.mouseTracker = null;
    this.clickHandler = null;
    this.soundManager = null;
    this.clock = new THREE.Clock();

    this.init();
  }

  async init() {
    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a); // Dark background

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(0, 0, 0);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    // Load environment map
    const { envMap, background } = await this.loadEnvironmentMap();
    this.scene.environment = envMap;
    this.scene.background = background;

    // Create eyeball
    this.eyeball = new Eyeball(envMap);
    this.scene.add(this.eyeball.getGroup());

    // Setup controls
    new TweakpaneControls(this.eyeball);

    // Setup mouse tracking
    this.mouseTracker = new MouseTracker(this.camera, this.eyeball.getGroup(), this.eyeball);

    // Setup sound manager
    this.soundManager = new SoundManager();
    await this.soundManager.init();
    this.soundManager.enableAudioOnInteraction();

    // Setup click handler (after sound manager)
    this.clickHandler = new ClickHandler(
      this.camera,
      this.eyeball.getMesh(),
      this.soundManager
    );

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation loop
    this.animate();

    console.log('Spooky Eyeball initialized! 👁️');
    console.log('Move your mouse to make the eye follow you.');
    console.log('Click on the eyeball to make it jiggle!');
  }

  async loadEnvironmentMap() {
    const loader = new THREE.TextureLoader();

    try {
      const texture = await loader.loadAsync('/textures/environment.jpg');
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;

      // Convert equirectangular texture to cube map using PMREMGenerator
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();

      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      // Clean up the generator (but keep the texture for background)
      pmremGenerator.dispose();

      console.log('Environment map loaded successfully');

      // Return both the cube map for reflections and original for background
      return { envMap, background: texture };
    } catch (error) {
      console.error('Could not load environment map:', error);
      console.log('Please add environment.jpg to public/textures/ directory');

      // Return a fallback dark texture
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 1, 1);
      const fallback = new THREE.CanvasTexture(canvas);
      return { envMap: fallback, background: fallback };
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();

    // Update mouse tracking
    if (this.mouseTracker) {
      this.mouseTracker.update();
    }

    // Update jiggle animation
    if (this.clickHandler) {
      this.clickHandler.update(deltaTime);
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Start the app
new SpookyEyeballApp();
