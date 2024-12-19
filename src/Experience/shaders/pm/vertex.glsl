uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uVisibleCount; // New uniform to control visible count

attribute float aScale;

void main() {
    // Get the current index of the particle
    float particleIndex = float(gl_VertexID);

    // Discard particles beyond the visible count
    if (particleIndex >= uVisibleCount) {
        gl_Position = vec4(0.0); // Send them off-screen
        gl_PointSize = 0.0; // Prevent rendering
        return;
    }

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Add any animation logic here if needed
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale * uPixelRatio;
}


// uniform float uTime;
// uniform float uPixelRatio;
// uniform float uSize;

// attribute float aScale;

// void main()
// {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     modelPosition.y += sin(modelPosition.x * 100.0 + uTime) * aScale * 0.2;

//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectionPosition = projectionMatrix * viewPosition;
    
//     gl_Position = projectionPosition;
//     gl_PointSize = uSize * aScale * uPixelRatio;
//     gl_PointSize *= (1.0 / - viewPosition.z);

// } 