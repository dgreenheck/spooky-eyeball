import { noiseGLSL } from './noise.glsl.js';

export const fragmentShader = `
${noiseGLSL}

uniform vec3 uPupilColor;
uniform vec3 uIrisColor;
uniform vec3 uScleraColor;
uniform float uPupilSize;
uniform float uIrisSize;
uniform float uIrisFeather;

// Limbus band (transition between iris and sclera)
uniform vec3 uLimbusColor;
uniform float uLimbusThickness;
uniform float uLimbusFalloff;
uniform float uLimbusOpacity;

// Iris noise parameters
uniform int uNoiseOctaves;
uniform float uNoiseFrequency;
uniform float uNoiseAmplitude;
uniform float uNoiseLacunarity;
uniform float uNoiseGain;

// Vein parameters
uniform vec3 uVeinColor;
uniform float uVeinIntensity;
uniform float uVeinBumpStrength;

// Layer 1
uniform float uVeinFrequency;
uniform int uVeinOctaves;
uniform float uVeinLacunarity;
uniform float uVeinGain;
uniform float uVeinThreshold;
uniform float uVeinThickness;

// Layer 2
uniform float uVeinFrequency2;
uniform int uVeinOctaves2;
uniform float uVeinLacunarity2;
uniform float uVeinGain2;
uniform float uVeinThreshold2;
uniform float uVeinThickness2;

// Fresnel redness
uniform float uRednessIntensity;
uniform float uRednessPower;
uniform int uRednessNoiseOctaves;
uniform float uRednessNoiseThreshold;
uniform float uRednessNoiseMagnitude;
uniform vec3 uEyeDirection; // Direction the eye is pointing

// Depth fade (stronger at back of eye)
uniform float uDepthFade;

// Lighting
uniform vec3 uLightPosition;
uniform float uSpecularIntensity;
uniform float uShininess;
uniform float uFresnelPower;

// Environment map
uniform samplerCube uEnvMap;
uniform float uEnvMapIntensity;
uniform float uEnvMapBlur;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
    // Calculate polar coordinates from front-facing position
    // The eye is looking down the +Z axis, so we use X and Y
    vec3 normalizedPos = normalize(vPosition);
    float distanceFromCenter = length(normalizedPos.xy);
    float angle = atan(normalizedPos.y, normalizedPos.x);

    // Create iris pattern using FBM noise
    vec2 noiseCoord = vec2(angle, distanceFromCenter);
    float irisNoise = fbm(
        noiseCoord,
        uNoiseOctaves,
        uNoiseFrequency,
        uNoiseAmplitude,
        uNoiseLacunarity,
        uNoiseGain
    );

    // Determine which part of the eye we're rendering
    vec3 baseColor;
    float alpha = 1.0;

    // Only render on the front hemisphere (facing forward)
    if (distanceFromCenter < uPupilSize) {
        // Pupil
        baseColor = uPupilColor;
    } else if (distanceFromCenter < uIrisSize + uLimbusThickness) {
        // Iris with noise pattern and limbus transition
        float irisBlend = smoothstep(uPupilSize, uPupilSize + 0.05, distanceFromCenter);

        // Base iris pattern with noise
        vec3 irisPattern = uIrisColor * (0.7 + 0.3 * irisNoise);

        // Add radial darkening towards edge
        float radialGradient = smoothstep(uIrisSize, uPupilSize, distanceFromCenter);
        irisPattern *= 0.5 + 0.5 * radialGradient;

        // Calculate limbus transition at iris edge
        // Limbus starts at inner edge and extends outward by limbusThickness
        float limbusStart = uIrisSize - uLimbusThickness * 0.5;
        float limbusEnd = uIrisSize + uLimbusThickness * 0.5;
        float limbusGradient = smoothstep(limbusStart, limbusEnd, distanceFromCenter);

        // Blend iris color with limbus color based on:
        // 1. Distance (limbusGradient) - more limbus near edge
        // 2. Noise intensity - darker areas get more limbus
        float noiseIntensity = 0.7 + 0.3 * irisNoise; // Match the noise contribution
        float limbusFactor = limbusGradient * (1.0 - noiseIntensity * (1.0 - uLimbusFalloff));
        limbusFactor = clamp(limbusFactor * uLimbusOpacity, 0.0, 1.0);

        // Mix iris and limbus colors
        vec3 irisWithLimbus = mix(irisPattern, uLimbusColor, limbusFactor);

        baseColor = mix(uPupilColor, irisWithLimbus, irisBlend);

        // Fade out opacity at the very edge
        float edgeFadeStart = uIrisSize + uLimbusThickness * 0.3;
        float edgeFadeEnd = uIrisSize + uLimbusThickness;
        float edgeFade = 1.0 - smoothstep(edgeFadeStart, edgeFadeEnd, distanceFromCenter);

        // Blend with sclera using edge fade as opacity
        baseColor = mix(uScleraColor, baseColor, edgeFade);
    } else {
        // Sclera (white of eye) with veins
        baseColor = uScleraColor;

        // Calculate depth-based fade (stronger towards back of eye)
        // Front (z=1.0) = 0.0, Back (z=-1.0) = 2.0
        float depthFactor = (1.0 - normalizedPos.z) * 0.5 + 0.5; // Normalized to 0-1
        depthFactor = mix(1.0, depthFactor, uDepthFade);

        // First layer of veins
        float veinNoise1 = fbm3D(
            vPosition,
            uVeinOctaves,
            uVeinFrequency,
            1.0,
            uVeinLacunarity,
            uVeinGain
        );
        veinNoise1 = smoothstep(uVeinThreshold, uVeinThreshold - uVeinThickness, abs(veinNoise1));

        // Second layer of veins with separate noise parameters
        float veinNoise2 = fbm3D(
            vPosition,
            uVeinOctaves2,
            uVeinFrequency2,
            1.0,
            uVeinLacunarity2,
            uVeinGain2
        );
        veinNoise2 = smoothstep(uVeinThreshold2, uVeinThreshold2 - uVeinThickness2, abs(veinNoise2));

        // Take absolute value and threshold to create vein lines
        float veins = veinNoise1 + veinNoise2;

        // Fade veins out near the iris
        float veinFade = smoothstep(uIrisSize + uIrisFeather, uIrisSize + uIrisFeather + 0.1, distanceFromCenter);
        veins *= veinFade;

        // Apply depth fade to make veins stronger at back
        veins *= depthFactor;

        // Mix in vein color
        baseColor = mix(baseColor, uVeinColor, veins * uVeinIntensity);
    }

    // Calculate redness noise pattern (used for both bump and color)
    // Use same frequency characteristics as veins with abs() and threshold
    float rednessNoise1 = fbm3D(
        vPosition,
        uRednessNoiseOctaves,
        uVeinFrequency,
        1.0,
        uVeinLacunarity,
        uVeinGain
    );
    // Apply threshold with smoothstep to create vein-like patterns
    rednessNoise1 = smoothstep(uRednessNoiseThreshold, uRednessNoiseThreshold - 0.1, abs(rednessNoise1));

    float rednessNoise2 = fbm3D(
        vPosition,
        uRednessNoiseOctaves,
        uVeinFrequency2,
        1.0,
        uVeinLacunarity2,
        uVeinGain2
    );
    // Apply threshold with smoothstep to create vein-like patterns
    rednessNoise2 = smoothstep(uRednessNoiseThreshold, uRednessNoiseThreshold - 0.1, abs(rednessNoise2));

    // Combine redness noise layers
    float rednessNoise = rednessNoise1 + rednessNoise2;

    // Calculate normal with vein and redness bump mapping
    vec3 normal = normalize(vNormal);

    // Calculate bump effect from both veins and redness
    if (uVeinBumpStrength > 0.0) {
        // Sample vein noise at current position for both layers
        // Apply the same processing as the vein rendering to match pattern
        float veinBump1 = fbm3D(
            vPosition,
            uVeinOctaves,
            uVeinFrequency,
            1.0,
            uVeinLacunarity,
            uVeinGain
        );
        veinBump1 = smoothstep(uVeinThreshold, uVeinThreshold - uVeinThickness, abs(veinBump1));

        float veinBump2 = fbm3D(
            vPosition,
            uVeinOctaves2,
            uVeinFrequency2,
            1.0,
            uVeinLacunarity2,
            uVeinGain2
        );
        veinBump2 = smoothstep(uVeinThreshold2, uVeinThreshold2 - uVeinThickness2, abs(veinBump2));

        // Combine vein and redness noise for bump mapping
        float combinedBump = veinBump1 + veinBump2 + rednessNoise;

        // Calculate gradient using screen-space derivatives
        float bumpDx = dFdx(combinedBump);
        float bumpDy = dFdy(combinedBump);

        // Create tangent space perturbation
        // Use the surface's tangent vectors to perturb the normal
        vec3 surfaceNormal = normalize(vNormal);
        vec3 tangent = normalize(cross(surfaceNormal, vec3(0.0, 1.0, 0.0)));
        vec3 bitangent = normalize(cross(surfaceNormal, tangent));

        // Apply perturbation
        vec3 perturbation = tangent * bumpDx + bitangent * bumpDy;
        normal = normalize(surfaceNormal + perturbation * uVeinBumpStrength);
    }

    // Calculate Fresnel effect for glossy appearance
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, normal)), uFresnelPower);

    // Add directional redness based on eye pointing direction
    // Redness is stronger on the opposite side of where the eye is looking
    vec3 eyeDir = normalize(uEyeDirection);
    float eyeDirDot = dot(normal, eyeDir);
    // Surfaces facing away from eye direction get more red
    float redness = pow(1.0 - eyeDirDot * 0.5 - 0.5, uRednessPower);

    // Add the pre-calculated vein-based noise to redness
    redness = redness + rednessNoise * uRednessNoiseMagnitude;
    redness = clamp(redness, 0.0, 1.0);

    // Calculate depth factor for redness (same as veins)
    float depthFactor = (1.0 - normalizedPos.z) * 0.5;
    depthFactor = mix(1.0, depthFactor, uDepthFade);

    baseColor = mix(baseColor, uVeinColor, redness * uRednessIntensity * depthFactor);

    // Environment map reflection
    vec3 reflectDir = reflect(-viewDir, normal);
    vec3 envColor = textureLod(uEnvMap, reflectDir, uEnvMapBlur).rgb;

    // Combine all lighting effects
    vec3 finalColor = baseColor;

    // Add environment reflection with Fresnel
    finalColor = mix(finalColor, envColor, fresnel * uEnvMapIntensity * 0.5);

    gl_FragColor = vec4(finalColor, alpha);
}
`;
