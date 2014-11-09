varying vec3 mPosition;
varying vec3 vectorPosition;
varying vec3 vectorNormal;
varying float height;

varying float lightIntensity;

uniform vec3 sampleOrigin;
uniform vec3 sampleScale;

const vec3 blue = vec3(0.2, 0.5, 0.9);
const vec3 beach = vec3(0.95, 1.0, 0.7);
const vec3 aqua = vec3(0.0, 0.9, 0.9);
const vec3 green = vec3(0.4, 0.8, 0.6);
const vec3 green2 = vec3(0.3, 0.6, 0.5);
const vec3 white = vec3(3.0, 3.0, 3.0);

const float level1 = 0.0;
const float level2 = 0.1;
const float sandLevel = 0.012;
const float level3 = 0.7;
const float level4 = 1.0;

vec3 colorFromGradient(float n) {
  if(n < level1) return blue;
  else if (n < level2) {
    float p = 1.0/(level2-level1)*(n - level1);
    return p*aqua+(1.0-p)*blue;
  }
  else if (n < level2+sandLevel) {
    return beach;
  }
  else if (n < level3) {
    float p = 1.0/(level3-level2)*(n - level2);
    return p*green2+(1.0-p)*green;
  } else {
    float p = 1.0/(level4-level3)*(n - level3);
    return p*white+(1.0-p)*green2;
  }
}

void main() {
  vec3 color = colorFromGradient(height);
  color *= lightIntensity;
  gl_FragColor = vec4(color, 1.0);
}
