void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Setup canvas
    vec2 uv = fragCoord/iResolution.xy;     // 0 <= uv <= 1
    uv -= 0.5;                              // -0.5 <= uv <= 0.5
    uv.x *= iResolution.x / iResolution.y;  // Fix aspect ratio

    float radius = length(uv) * 2.0;
    float angle = atan(uv.y, uv.x) + iTime;
    
    //float function = cos(angle * 3.0);
    //float function = abs(cos(angle * 3.0));
    //float function = abs(cos(angle * 2.5)) * 0.5 + 0.3;
    //float function = abs(cos(angle * 12.0) * sin(angle * 3.0)) * 0.8 + 0.1;
    float function = smoothstep(-0.5, 1.0, cos(angle * 10.0)) * 0.2 + 0.5;

    vec3 colour = vec3(1.0 - smoothstep(function, function + 0.02, radius) * 1.0 - smoothstep(function, function / 2.0, radius));

    // Output to screen
    fragColor = vec4(colour, 1.0);
}
