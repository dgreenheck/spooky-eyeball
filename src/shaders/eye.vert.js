export const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vPosition = position;

    gl_Position = projectionMatrix * mvPosition;
}
`;
