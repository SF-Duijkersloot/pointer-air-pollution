void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    // distanceToCenter = pow(distanceToCenter, 10.0);
    float strength = 0.05 / distanceToCenter - (0.05 * 2.0);
    
    gl_FragColor = vec4(vec3(1.0), strength);
}