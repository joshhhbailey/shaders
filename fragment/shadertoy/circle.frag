float createCircle(vec2 _uv, vec2 _pos, float _radius, float _blur)
{
    float distance = length(_uv - _pos);
    return smoothstep(_radius, _radius - _blur, distance);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Setup canvas
    vec2 uv = fragCoord / iResolution.xy;     // 0 <= uv <= 1
    uv -= 0.5;                              // -0.5 <= uv <= 0.5
    uv.x *= iResolution.x / iResolution.y;  // Fix aspect ratio

    // Create shape
    float circle = createCircle(uv, vec2(0.0), 0.3, 0.01);
    circle -= createCircle(uv, vec2(0.2), 0.1, 0.01);
    
    // Shape colour
    vec3 colour = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0.0, 2.0, 4.0));
    colour *= circle;
    
    // Background colour
    if (circle <= 0.0)
    {
        colour = vec3(1.0);
    }
    
    // Output to screen
    fragColor = vec4(colour, 1.0);
}
