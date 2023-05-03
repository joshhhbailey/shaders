// https://thebookofshaders.com/07/

#define PI 3.14159265359
#define TWO_PI 6.28318530718

float createNgon(vec2 _uv, vec2 _pos, int _vertices)
{
    // Set position
    _uv += _pos * -1.0;
    
	  float angle = atan(_uv.x, _uv.y) + PI;
  	float radius = TWO_PI / float(_vertices);
    
    // Shaping function to modulate distance
  	return cos(floor(0.5 + angle / radius) * radius - angle) * length(_uv);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Setup canvas
    vec2 uv = fragCoord/iResolution.xy;     // 0 <= uv <= 1
    uv -= 0.5;                              // -0.5 <= uv <= 0.5
    uv.x *= iResolution.x / iResolution.y;  // Fix aspect ratio

    float ngon = createNgon(uv, vec2(0.0, 0.0), 5);
    
    float distanceField = length(abs(ngon) - 0.3);
    //float distanceField = length(min(abs(ngon) - 0.3, 0.0));
    //float distanceField = length(max(abs(ngon) - 0.4, -0.0));

    vec3 colour = vec3(fract(distanceField * 10.0));

    fragColor = vec4(colour, 1.0);
}
