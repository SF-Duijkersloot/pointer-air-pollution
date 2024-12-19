uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uVisibleCount;
attribute float aScale;

// Classic Perlin noise
float permute(float x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    vec3 u = f * f * (3.0 - 2.0 * f); // Smoothstep interpolation

    float n = dot(i, vec3(1.0, 57.0, 113.0));
    return mix(
        mix(
            mix(permute(n + 0.0), permute(n + 1.0), u.x),
            mix(permute(n + 57.0), permute(n + 58.0), u.x),
            u.y
        ),
        mix(
            mix(permute(n + 113.0), permute(n + 114.0), u.x),
            mix(permute(n + 170.0), permute(n + 171.0), u.x),
            u.y
        ),
        u.z
    ) / 289.0;
}

// Fractal Brownian Motion (FBM)
float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}

void main() {
    float particleIndex = float(gl_VertexID);

    // Discard particles beyond the visible count
    if (particleIndex >= uVisibleCount) {
        gl_Position = vec4(0.0);
        gl_PointSize = 0.0;
        return;
    }

    // FBM-based displacement for realistic swirling motion
    vec3 fbmInput = position + vec3(uTime * 0.1, uTime * 0.2, 0.0);
    float fbmDisplacementX = fbm(fbmInput + vec3(0.0, 0.0, 0.0)) * 0.1;
    float fbmDisplacementY = fbm(fbmInput + vec3(10.0, 0.0, 0.0)) * 0.1;
    float fbmDisplacementZ = fbm(fbmInput + vec3(20.0, 0.0, 0.0)) * 0.1;

    vec3 animatedPosition = position;
    animatedPosition.x += fbmDisplacementX;
    animatedPosition.y += fbmDisplacementY;
    animatedPosition.z += fbmDisplacementZ;

    vec4 modelPosition = modelMatrix * vec4(animatedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale * uPixelRatio;
}
