import { Pane } from 'tweakpane';

export class TweakpaneControls {
  constructor(eyeball) {
    this.eyeball = eyeball;
    this.pane = new Pane({ title: 'Spooky Eyeball Controls' });

    this.setupControls();
  }

  setupControls() {
    // Pupil folder
    const pupilFolder = this.pane.addFolder({ title: 'Pupil', expanded: true });

    pupilFolder.addBinding(this.eyeball.params, 'pupilSize', {
      min: 0.05,
      max: 0.3,
      step: 0.01,
      label: 'Size'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uPupilSize', ev.value);
    });

    pupilFolder.addBinding(this.eyeball.params, 'pupilColor', {
      label: 'Color'
    }).on('change', (ev) => {
      this.eyeball.updateColor('uPupilColor', ev.value);
    });

    // Iris folder
    const irisFolder = this.pane.addFolder({ title: 'Iris', expanded: true });

    irisFolder.addBinding(this.eyeball.params, 'irisSize', {
      min: 0.2,
      max: 0.6,
      step: 0.01,
      label: 'Size'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uIrisSize', ev.value);
    });

    irisFolder.addBinding(this.eyeball.params, 'irisInnerColor', {
      label: 'Inner Color'
    }).on('change', (ev) => {
      this.eyeball.updateColor('uIrisInnerColor', ev.value);
    });

    irisFolder.addBinding(this.eyeball.params, 'irisOuterColor', {
      label: 'Outer Color'
    }).on('change', (ev) => {
      this.eyeball.updateColor('uIrisOuterColor', ev.value);
    });

    // Limbus band sub-folder (transition ring between iris and sclera)
    const limbusFolder = irisFolder.addFolder({ title: 'Limbus Band', expanded: true });

    limbusFolder.addBinding(this.eyeball.params, 'limbusColor', {
      label: 'Color'
    }).on('change', (ev) => {
      this.eyeball.updateColor('uLimbusColor', ev.value);
    });

    limbusFolder.addBinding(this.eyeball.params, 'limbusThickness', {
      min: 0.0,
      max: 0.1,
      step: 0.005,
      label: 'Thickness'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uLimbusThickness', ev.value);
    });

    limbusFolder.addBinding(this.eyeball.params, 'limbusFalloff', {
      min: 0.0,
      max: 1.0,
      step: 0.05,
      label: 'Falloff'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uLimbusFalloff', ev.value);
    });

    limbusFolder.addBinding(this.eyeball.params, 'limbusOpacity', {
      min: 0.0,
      max: 1.0,
      step: 0.05,
      label: 'Opacity'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uLimbusOpacity', ev.value);
    });

    // Iris noise sub-folder
    const noiseFolder = irisFolder.addFolder({ title: 'Noise Pattern', expanded: true });

    noiseFolder.addBinding(this.eyeball.params, 'noiseOctaves', {
      min: 1,
      max: 8,
      step: 1,
      label: 'Octaves'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uNoiseOctaves', ev.value);
    });

    noiseFolder.addBinding(this.eyeball.params, 'noiseFrequency', {
      min: 0.1,
      max: 1.0,
      step: 0.01,
      label: 'Frequency'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uNoiseFrequency', ev.value);
    });

    noiseFolder.addBinding(this.eyeball.params, 'noiseAmplitude', {
      min: 0.0,
      max: 2.0,
      step: 0.1,
      label: 'Amplitude'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uNoiseAmplitude', ev.value);
    });

    noiseFolder.addBinding(this.eyeball.params, 'noiseLacunarity', {
      min: 1.0,
      max: 4.0,
      step: 0.1,
      label: 'Lacunarity'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uNoiseLacunarity', ev.value);
    });

    noiseFolder.addBinding(this.eyeball.params, 'noiseGain', {
      min: 0.0,
      max: 1.0,
      step: 0.05,
      label: 'Gain'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uNoiseGain', ev.value);
    });

    // Sclera folder
    const scleraFolder = this.pane.addFolder({ title: 'Sclera (White)', expanded: true });

    scleraFolder.addBinding(this.eyeball.params, 'scleraColor', {
      label: 'Color'
    }).on('change', (ev) => {
      this.eyeball.updateColor('uScleraColor', ev.value);
    });

    scleraFolder.addBinding(this.eyeball.params, 'depthFade', {
      min: 0.0,
      max: 1.0,
      step: 0.05,
      label: 'Depth Fade'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uDepthFade', ev.value);
    });

    // Vein sub-folder
    const veinFolder = scleraFolder.addFolder({ title: 'Veins', expanded: true });

    veinFolder.addBinding(this.eyeball.params, 'veinColor', {
      label: 'Color'
    }).on('change', (ev) => {
      this.eyeball.updateColor('uVeinColor', ev.value);
    });

    veinFolder.addBinding(this.eyeball.params, 'veinIntensity', {
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: 'Intensity'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinIntensity', ev.value);
    });

    veinFolder.addBinding(this.eyeball.params, 'veinBumpStrength', {
      min: 0.0,
      max: 2.0,
      step: 0.05,
      label: 'Bump Strength'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinBumpStrength', ev.value);
    });

    // Layer 1 sub-folder
    const veinLayer1Folder = veinFolder.addFolder({ title: 'Layer 1', expanded: false });

    veinLayer1Folder.addBinding(this.eyeball.params, 'veinFrequency', {
      min: 1.0,
      max: 15.0,
      step: 0.5,
      label: 'Frequency'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinFrequency', ev.value);
    });

    veinLayer1Folder.addBinding(this.eyeball.params, 'veinOctaves', {
      min: 1,
      max: 5,
      step: 1,
      label: 'Octaves'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinOctaves', ev.value);
    });

    veinLayer1Folder.addBinding(this.eyeball.params, 'veinLacunarity', {
      min: 1.0,
      max: 4.0,
      step: 0.1,
      label: 'Lacunarity'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinLacunarity', ev.value);
    });

    veinLayer1Folder.addBinding(this.eyeball.params, 'veinGain', {
      min: 0.0,
      max: 1.0,
      step: 0.05,
      label: 'Gain'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinGain', ev.value);
    });

    veinLayer1Folder.addBinding(this.eyeball.params, 'veinThreshold', {
      min: 0.0,
      max: 0.1,
      step: 0.001,
      label: 'Threshold'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinThreshold', ev.value);
    });

    veinLayer1Folder.addBinding(this.eyeball.params, 'veinThickness', {
      min: 0.0,
      max: 0.1,
      step: 0.001,
      label: 'Thickness'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinThickness', ev.value);
    });
    // Layer 2 sub-folder
    const veinLayer2Folder = veinFolder.addFolder({ title: 'Layer 2', expanded: false });

    veinLayer2Folder.addBinding(this.eyeball.params, 'veinFrequency2', {
      min: 1.0,
      max: 15.0,
      step: 0.5,
      label: 'Frequency'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinFrequency2', ev.value);
    });

    veinLayer2Folder.addBinding(this.eyeball.params, 'veinOctaves2', {
      min: 1,
      max: 5,
      step: 1,
      label: 'Octaves'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinOctaves2', ev.value);
    });

    veinLayer2Folder.addBinding(this.eyeball.params, 'veinLacunarity2', {
      min: 1.0,
      max: 4.0,
      step: 0.1,
      label: 'Lacunarity'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinLacunarity2', ev.value);
    });

    veinLayer2Folder.addBinding(this.eyeball.params, 'veinGain2', {
      min: 0.0,
      max: 1.0,
      step: 0.05,
      label: 'Gain'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinGain2', ev.value);
    });

    veinLayer2Folder.addBinding(this.eyeball.params, 'veinThreshold2', {
      min: 0.0,
      max: 0.1,
      step: 0.001,
      label: 'Threshold'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinThreshold2', ev.value);
    });

    veinLayer2Folder.addBinding(this.eyeball.params, 'veinThickness2', {
      min: 0.0,
      max: 0.1,
      step: 0.001,
      label: 'Thickness'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uVeinThickness2', ev.value);
    });

    // Redness sub-folder
    const rednessFolder = scleraFolder.addFolder({ title: 'Fresnel Redness', expanded: true });

    rednessFolder.addBinding(this.eyeball.params, 'depthFade', {
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: 'Depth Fade'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uDepthFade', ev.value);
    });

    rednessFolder.addBinding(this.eyeball.params, 'rednessIntensity', {
      min: 0.0,
      max: 10,
      step: 0.01,
      label: 'Intensity'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uRednessIntensity', ev.value);
    });

    rednessFolder.addBinding(this.eyeball.params, 'rednessPower', {
      min: 1.0,
      max: 10.0,
      step: 0.1,
      label: 'Power'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uRednessPower', ev.value);
    });

    rednessFolder.addBinding(this.eyeball.params, 'rednessNoiseOctaves', {
      min: 1,
      max: 8,
      step: 1,
      label: 'Vein Pattern Octaves'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uRednessNoiseOctaves', ev.value);
    });

    rednessFolder.addBinding(this.eyeball.params, 'rednessNoiseThreshold', {
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: 'Vein Pattern Threshold'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uRednessNoiseThreshold', ev.value);
    });

    rednessFolder.addBinding(this.eyeball.params, 'rednessNoiseMagnitude', {
      min: 0.0,
      max: 2.0,
      step: 0.05,
      label: 'Vein Pattern Opacity'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uRednessNoiseMagnitude', ev.value);
    });

    // Lighting folder
    const lightingFolder = this.pane.addFolder({ title: 'Lighting', expanded: true });

    lightingFolder.addBinding(this.eyeball.params, 'fresnelPower', {
      min: 0.1,
      max: 10.0,
      step: 0.1,
      label: 'Fresnel Power'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uFresnelPower', ev.value);
    });

    lightingFolder.addBinding(this.eyeball.params, 'envMapIntensity', {
      min: 0.0,
      max: 2.0,
      step: 0.1,
      label: 'Env Map'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uEnvMapIntensity', ev.value);
    });

    lightingFolder.addBinding(this.eyeball.params, 'envMapBlur', {
      min: 0.0,
      max: 10.0,
      step: 0.1,
      label: 'Env Blur'
    }).on('change', (ev) => {
      this.eyeball.updateParam('uEnvMapBlur', ev.value);
    });
  }
}
