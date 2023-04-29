float createBand(float _uv, float _start, float _end, float _blur)
{
    float stepA = smoothstep(_start - _blur, _start + _blur, _uv);
    float stepB = smoothstep(_end + _blur, _end - _blur, _uv);
    return stepA * stepB;
}

float createQuadrilateral(vec2 _uv, vec2 _pos, vec2 _size, float _blur, vec4 _skew)
{
/* _skew
        .x = left edge
        .y = right edge
        .z = top edge
        .w = bottom edge
   
        ...can also handle rotations
        _skew = vec4(angle)
   
        angle
        1.0 = 90 degrees clockwise
        2.0 = 180 degrees clockwise
*/
    float bandA = createBand(_uv.x, (_pos.x - (_size.x / 2.0)) + (_uv.y * _skew.x), (_pos.x + (_size.x / 2.0)) + (_uv.y * _skew.y), _blur);
    float bandB = createBand(_uv.y, (_pos.y - (_size.y / 2.0)) + (_uv.x * _skew.w * -1.0), (_pos.y + (_size.y / 2.0)) + (_uv.x * _skew.z * -1.0), _blur);
    return bandA * bandB;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Setup canvas
    vec2 uv = fragCoord / iResolution.xy;   // 0 <= uv <= 1
    uv -= 0.5;                              // -0.5 <= uv <= 0.5
    uv.x *= iResolution.x / iResolution.y;  // Fix aspect ratio

    // Create shape
    float shape = createQuadrilateral(uv, vec2(0.0), vec2(0.7, 0.7), 0.02, vec4(1.0));
    shape += createQuadrilateral(uv, vec2(0.0), vec2(0.3, 0.3), 0.01, vec4(0.0));
    shape -= createQuadrilateral(uv, vec2(0.0), vec2(0.3, 0.1), 0.01, vec4(0.0));
    
    // Shape colour
    vec3 colour = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0.0, 2.0, 4.0));
    colour *= shape;
    
    // Background colour
    if (shape <= 0.0)
    {
        colour = vec3(1.0);
    }
    
    // Output to screen
    fragColor = vec4(colour, 1.0);
}
