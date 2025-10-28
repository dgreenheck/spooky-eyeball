import * as THREE from 'three';
import { vertexShader } from '../shaders/eye.vert.js';
import { fragmentShader } from '../shaders/eye.frag.js';

export class Eyeball {
  constructor(envMap) {
    // Default parameters
    this.params = {
      pupilSize: 0.15,
      pupilColor: { r: 0, g: 0, b: 0 },
      irisSize: 0.37,
      irisInnerColor: { r: 255, g: 115, b: 0 },
      irisOuterColor: { r: 136, g: 47, b: 3 },
      irisFeather: 0.0, // Small value for blending, limbus band handles visual transition
      scleraColor: { r: 255, g: 248, b: 240 },

      // Limbus band (transition between iris and sclera)
      limbusColor: { r: 29, g: 13, b: 0 },
      limbusThickness: 0.05,
      limbusFalloff: 0.7,
      limbusOpacity: 1.0,

      // Noise parameters
      noiseOctaves: 8,
      noiseFrequency: 0.57,
      noiseAmplitude: 2,
      noiseLacunarity: 2,
      noiseGain: 0.9,

      // Vein parameters
      veinColor: { r: 255, g: 0, b: 0 },
      veinIntensity: 0.7,
      veinBumpStrength: 0.1,

      // Layer 1
      veinFrequency: 2,
      veinOctaves: 5,
      veinLacunarity: 1.7,
      veinGain: 0.55,
      veinThreshold: 0.052,
      veinThickness: 0.1,

      // Layer 2
      veinFrequency2: 6.0,
      veinOctaves2: 4,
      veinLacunarity2: 2.1,
      veinGain2: 0.5,
      veinThreshold2: 0.04,
      veinThickness2: 0.1,

      // Fresnel redness
      depthFade: 0.92,
      rednessIntensity: 5,
      rednessPower: 1,
      rednessNoiseOctaves: 5,
      rednessNoiseThreshold: 0.18,
      rednessNoiseMagnitude: 0.05,

      // Lighting
      fresnelPower: 1.4,
      envMapIntensity: 2,
      envMapBlur: 6
    };

    // Create sphere geometry
    this.geometry = new THREE.SphereGeometry(1, 64, 64);

    // Create shader material
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPupilColor: { value: new THREE.Color(this.params.pupilColor.r / 255, this.params.pupilColor.g / 255, this.params.pupilColor.b / 255) },
        uIrisInnerColor: { value: new THREE.Color(this.params.irisInnerColor.r / 255, this.params.irisInnerColor.g / 255, this.params.irisInnerColor.b / 255) },
        uIrisOuterColor: { value: new THREE.Color(this.params.irisOuterColor.r / 255, this.params.irisOuterColor.g / 255, this.params.irisOuterColor.b / 255) },
        uScleraColor: { value: new THREE.Color(this.params.scleraColor.r / 255, this.params.scleraColor.g / 255, this.params.scleraColor.b / 255) },
        uPupilSize: { value: this.params.pupilSize },
        uIrisSize: { value: this.params.irisSize },
        uIrisFeather: { value: this.params.irisFeather },

        uLimbusColor: { value: new THREE.Color(this.params.limbusColor.r / 255, this.params.limbusColor.g / 255, this.params.limbusColor.b / 255) },
        uLimbusThickness: { value: this.params.limbusThickness },
        uLimbusFalloff: { value: this.params.limbusFalloff },
        uLimbusOpacity: { value: this.params.limbusOpacity },

        uNoiseOctaves: { value: this.params.noiseOctaves },
        uNoiseFrequency: { value: this.params.noiseFrequency },
        uNoiseAmplitude: { value: this.params.noiseAmplitude },
        uNoiseLacunarity: { value: this.params.noiseLacunarity },
        uNoiseGain: { value: this.params.noiseGain },

        uVeinColor: { value: new THREE.Color(200 / 255, 50 / 255, 50 / 255) },
        uVeinIntensity: { value: this.params.veinIntensity },
        uVeinBumpStrength: { value: this.params.veinBumpStrength },

        // Layer 1
        uVeinFrequency: { value: this.params.veinFrequency },
        uVeinOctaves: { value: this.params.veinOctaves },
        uVeinLacunarity: { value: this.params.veinLacunarity },
        uVeinGain: { value: this.params.veinGain },
        uVeinThreshold: { value: this.params.veinThreshold },
        uVeinThickness: { value: this.params.veinThickness },

        // Layer 2
        uVeinFrequency2: { value: this.params.veinFrequency2 },
        uVeinOctaves2: { value: this.params.veinOctaves2 },
        uVeinLacunarity2: { value: this.params.veinLacunarity2 },
        uVeinGain2: { value: this.params.veinGain2 },
        uVeinThreshold2: { value: this.params.veinThreshold2 },
        uVeinThickness2: { value: this.params.veinThickness2 },

        uRednessIntensity: { value: this.params.rednessIntensity },
        uRednessPower: { value: this.params.rednessPower },
        uRednessNoiseOctaves: { value: this.params.rednessNoiseOctaves },
        uRednessNoiseThreshold: { value: this.params.rednessNoiseThreshold },
        uRednessNoiseMagnitude: { value: this.params.rednessNoiseMagnitude },
        uEyeDirection: { value: new THREE.Vector3(0, 0, 1) },

        uDepthFade: { value: this.params.depthFade },
        uFresnelPower: { value: this.params.fresnelPower },

        uEnvMap: { value: envMap },
        uEnvMapIntensity: { value: this.params.envMapIntensity },
        uEnvMapBlur: { value: this.params.envMapBlur },

        uTime: { value: 0 }
      }
    });

    // Create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // Group to handle rotation for eye tracking
    this.group = new THREE.Group();
    this.group.add(this.mesh);
  }

  updateColor(uniformName, colorObj) {
    const color = new THREE.Color(
      colorObj.r / 255,
      colorObj.g / 255,
      colorObj.b / 255
    );
    this.material.uniforms[uniformName].value = color;
  }

  updateParam(uniformName, value) {
    if (this.material.uniforms[uniformName]) {
      this.material.uniforms[uniformName].value = value;
    }
  }

  getGroup() {
    return this.group;
  }

  getMesh() {
    return this.mesh;
  }

  update(time) {
    this.material.uniforms.uTime.value = time;
  }
}
