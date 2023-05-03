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

float horizontalWave(vec2 _uv, float _wavelength, float _amplitude)
{
    return _uv.y -= sin(iTime + _uv.x * _wavelength) * _amplitude;
}

float remap(vec2 _rangeA, vec2 _rangeB, float _value)
{
    return clamp(((_value - _rangeA.x) / (_rangeA.y - _rangeA.x)), 0.0, 1.0) * (_rangeB.y - _rangeB.x) + _rangeB.x;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Setup canvas
    vec2 uv = fragCoord / iResolution.xy;   // 0 <= uv <= 1
    uv -= 0.5;                              // -0.5 <= uv <= 0.5
    uv.x *= iResolution.x / iResolution.y;  // Fix aspect ratio

    // Create shape
    float y = horizontalWave(uv, 8.0, 0.1);
    vec2 pos = vec2(0.0);
    vec2 size = vec2(1.8, 0.1);
    float blur = remap(vec2(pos.x - (size.x / 2.0), pos.x + (size.x / 2.0)), vec2(0.01, 0.25), -uv.x);
    float shape = createQuadrilateral(vec2(uv.x, y), pos, size, blur, vec4(0.0));
    
    // Shape colour
    vec3 colour = vec3(1.0);
    colour *= shape;
    
    // Output to screen
    fragColor = vec4(colour, 1.0);
}
