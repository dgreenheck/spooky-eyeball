# Spooky Eyeball - Halloween Three.js Demo

A creepy interactive eyeball that follows your mouse cursor, built with Three.js and custom shaders.

## Credits

- Ambience: Sound Effect by <a href="https://pixabay.com/users/placidplace-25572496/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=121665">Iris,Helen,silvy</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=121665">Pixabay</a>

## Features

- **Custom Shader Eyeball**: Entire eyeball rendered in a single shader

  - Procedural iris pattern using FBM (Fractal Brownian Motion) noise
  - Realistic pupil and iris with parametric controls
  - Fresnel effect for glossy appearance
  - Specular highlights for wetness
  - Environment map reflections

- **Mouse Tracking**: Eye follows cursor with realistic rotation limits
- **Click Interaction**: Click the eyeball to make it jiggle with a squish sound
- **Tweakpane Controls**: Adjust all eyeball parameters in real-time
- **Spooky Audio**: Ambient Halloween sounds (when provided)

## Setup

1. **Install dependencies**:

```bash
npm install
```

2. **Add audio files** (optional):

   - Add `ambient.mp3` to `public/sounds/`
   - Add `squish.mp3` to `public/sounds/`
   - See `public/sounds/README.md` for recommendations

3. **Add environment map** (optional):

   - Add `environment.hdr` to `public/textures/`
   - See `public/textures/README.md` for recommendations

4. **Run the development server**:

```bash
npm run dev
```

5. **Build for production**:

```bash
npm run build
```

## Usage

- **Move your mouse** to make the eyeball track your cursor
- **Click the eyeball** to make it jiggle
- **Use the Tweakpane** on the right to adjust:
  - Pupil size and color
  - Iris size, color, and noise pattern
  - Sclera (white) color
  - Lighting properties (specular, fresnel, environment map)

## Project Structure

```
src/
├── main.js                    # App initialization and animation loop
├── shaders/
│   ├── eye.vert.js           # Vertex shader
│   ├── eye.frag.js           # Fragment shader (iris/pupil/fresnel/specular)
│   └── noise.glsl.js         # FBM noise functions
├── eyeball/
│   └── Eyeball.js            # Eyeball mesh and shader setup
├── controls/
│   └── TweakpaneControls.js  # UI controls
├── interaction/
│   ├── MouseTracker.js       # Mouse tracking with realistic constraints
│   └── ClickHandler.js       # Click detection and jiggle animation
└── audio/
    └── SoundManager.js       # Audio playback
```

## Technical Details

### Shader

The eyeball shader uses polar coordinates to create concentric circles for the pupil and iris. The iris pattern is generated using multi-octave FBM noise for a natural, organic look. Fresnel and specular calculations add realistic glossiness.

### Mouse Tracking

Eye rotation is constrained to ±30° (configurable) to maintain realistic movement, with smooth interpolation for natural motion.

### Jiggle Animation

Uses decaying sine waves on multiple axes to create a squishy deformation effect when clicked.

## Credits

Built with:

- [Three.js](https://threejs.org/)
- [Tweakpane](https://cocopon.github.io/tweakpane/)
- [Vite](https://vitejs.dev/)

Happy Halloween! 🎃👁️
