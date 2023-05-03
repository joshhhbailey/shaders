// https://www.shadertoy.com/view/lsXcWn
// https://youtu.be/ZlNnrpM0TRg
// Rayman Raving Rabbid

// Remap _value to a number within _range
float remap01(vec2 _range, float _value)
{
    return clamp((_value - _range.x) / (_range.y - _range.x), 0.0, 1.0);
}

// Remap _value to a number within _rangeB, based on _rangeA
float remap(vec2 _rangeA, vec2 _rangeB, float _value)
{
    return remap01(_rangeA, _value) * (_rangeB.y - _rangeB.x) + _rangeB.x;
}

// Confine _uv space to the bounds of _rect
vec2 within(vec2 _uv, vec4 _rect) {
	return (_uv - _rect.xy) / (_rect.zw - _rect.xy);
}

vec4 createEye(vec2 _uv)
{
    _uv -= 0.5;    // Renormalize UVs after using within(), -0.5 <= uv <= 0.5
    float dist = length(_uv);
    
    vec4 eyelidColour = vec4(0.97, 0.71, 0.6, 1.0);
    vec4 colour = mix(eyelidColour, vec4(1.0), smoothstep(0.1, 0.7, dist));
    colour.a = smoothstep(0.28, 0.23, dist);
    
    colour.rgb = mix(colour.rgb, vec3(1.0), smoothstep(0.5, 0.1, dist));                       // Sclera
    colour.rgb *= 1.0 - smoothstep(0.18, 0.4, dist) * 5.0 * clamp(-_uv.y - _uv.x, 0.0, 1.0);   // Eyeball shadow
    colour.rgb = mix(colour.rgb, vec3(0.0), smoothstep(0.15, 0.11, dist));                     // Iris outline
    vec4 irisColour = vec4(0.04, 0.63, 0.76, 1.0);
    irisColour.rgb *= 1.0 + smoothstep(0.08, 0.005, dist);                                     // Pupil outline
    colour.rgb = mix(colour.rgb, irisColour.rgb, smoothstep(0.13, 0.11, dist));                // Iris
    colour.rgb = mix(colour.rgb, vec3(0.0), smoothstep(0.06, 0.04, dist));                     // Pupil
    
    float highlight = smoothstep(0.05, 0.02, length(_uv - vec2(-0.05, 0.05)));
    highlight += smoothstep(0.03, 0.01, length(_uv + vec2(-0.08, 0.08)));
    colour.rgb = mix(colour.rgb, vec3(1.0), highlight);
    
    return colour;
}

vec4 createMouth(vec2 _uv)
{
    _uv -= 0.5;    // Renormalize UVs after using within(), -0.5 <= uv <= 0.5
    
    _uv.y *= 0.8;    // Elongate
    _uv.y -= _uv.x * _uv.x;
    float dist = length(_uv);
    
    vec4 innerMouthColour = vec4(0.5, 0.18, 0.05, 1.0);
    vec4 colour = mix(innerMouthColour, vec4(0.97, 0.71, 0.6, 1.0), smoothstep(0.2, 0.3, dist));
    colour.a = smoothstep(0.35, 0.28, dist);
    
    //float tdist = length(_uv + vec2(0.0, 0.15));
    //colour.rgb = mix(colour.rgb, vec3(1.0), smoothstep(0.1, 0.08, tdist));
    
    return colour;
}

vec4 createHead(vec2 _uv)
{
    _uv.y *= 0.8;    // Elongate
    _uv.y -= _uv.x * _uv.x * _uv.y * 3.0;    // Squircle
    vec4 colour = vec4(0.85, 0.85, 0.9, 1.0);
    
    // Base shape (circle)
    float dist = length(_uv);
    colour.a = smoothstep(0.3, 0.29, dist);
    
    // Faded edge
    float edge = remap01(vec2(0.26, 0.3), dist);
    edge *= edge;
    colour.rgb *= 1.0 - (edge * 0.5);
    
    // Forehead highlight
    float highlight = smoothstep(0.25, 0.19, dist);
    highlight *= remap(vec2(0.25, -0.1), vec2(0.75, 0.0), _uv.y);
    colour.rgb = mix(colour.rgb, vec3(1.0), highlight);
    
    return colour;
}

vec4 createRabbit(vec2 _uv)
{
    vec4 colour = vec4(0.0);
    
    // Mirror space
    _uv.x = abs(_uv.x);
    
    // Construct
    vec4 head = createHead(_uv);
    vec4 eye = createEye(within(_uv, vec4(0.03, -0.1, 0.37, 0.25)));
    vec4 mouth = createMouth(within(_uv, vec4(-0.3, -0.35, 0.3, 0.0)));
    
    colour = mix(colour, head, head.a);
    colour = mix(colour, eye, eye.a);
    colour = mix(colour, mouth, mouth.a);
    
    return colour;
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Setup canvas
    vec2 uv = fragCoord / iResolution.xy;   // 0 <= uv <= 1
    uv -= 0.5;                              // -0.5 <= uv <= 0.5
    uv.x *= iResolution.x / iResolution.y;  // Fix aspect ratio
    
    // Output to screen
    fragColor = createRabbit(uv);
}
