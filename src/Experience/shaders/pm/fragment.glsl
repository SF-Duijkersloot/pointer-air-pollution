uniform vec3 uColor;

void main() {
    // Calculate distance from center of point
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Create a softer falloff for the particle
    float strength = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Add a brighter core
    float core = 1.0 - smoothstep(0.0, 0.2, dist);
    strength = strength * 0.7 + core * 0.5;
    
    // Mix with color and adjust alpha
    vec3 color = uColor * (0.8 + core * 0.4);  // Boost color intensity in the center
    gl_FragColor = vec4(color, strength * 0.8);  // Adjust overall opacity
}