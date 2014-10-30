varying vec3 mPosition;
varying float lightIntensity;
varying float height;

uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
uniform float pointLightDistance[MAX_POINT_LIGHTS];

const float SpecularContribution = 0.0;
const float DiffuseContribution = 1.0 - SpecularContribution;

uniform vec3 sampleOrigin;
uniform vec3 sampleScale;
uniform float heightAdjust;
uniform vec2 quadScale;
uniform vec3 miscGridDimensions;
uniform int lod;
uniform float lodRange;

attribute vec2 coordinate;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float octaveNoise(vec3 p) {
  p = sampleScale * (sampleOrigin + p);
  float n = snoise(p);
  n += 0.5 * snoise(p * 2.0);
  n += 0.25 * snoise(p * 4.0);
  n += 0.125 * snoise(p * 8.0);
  n += 0.0625 * snoise(p * 16.0);
  n += 0.03125 * snoise(p * 32.0);
  n += 0.016 * snoise(p * 64.0);
  n = n * 0.7;
  return n;
}

// morphs input vertex uv from high to low detailed mesh position
// - gridPos: normalized [0, 1] .xy grid position of the source vertex
// - vertex: vertex.xy components in the world space
// - morphK: [0..1] ranges from 0 (no morph, high detail) to 1 (full morph, 4x fewer triangles)
vec2 morphVertex(vec2 gridPos, vec2 vertex, float morphLerpK)
{
  // based on: http://www.vertexasylum.com/downloads/cdlod/cdlod_latest.pdf, but using the optimized
  // code using pre-calculated grid dimension values

  // miscGridDimensions.y is 0.5*dimension of the grid
  // miscGridDimensions.z is 1/(0.5*dimension) of the grid

  vec2 fracPart = (fract(gridPos * miscGridDimensions.xx * 0.5) * 2.0/miscGridDimensions.xx);
  //return vertex - clamp(fracPart, 0.0, 1.0) * quadScale.xy * morphLerpK;

  return vec2(vertex.x + quadScale.x * morphLerpK, vertex.y - quadScale.y * morphLerpK);
}

const float morphStart = 0.7;
const float morphArea = 1.0-0.7;

float findMorphK(float distance)
{
  float morphStart = 0.7*lodRange; // 30% morph range
  return clamp((distance-morphStart)/(lodRange-morphStart), 0.0, 1.0);
}

vec4 morphVertexInWorld(vec3 position, vec4 vertex)
{
  float distance = length(vec3(viewMatrix * vertex));
  float morphK = findMorphK(distance);
  vec2 gridPos = normalize(position.xy);
  vec2 morphed = morphVertex(gridPos, vertex.xz, morphK);

  return vec4(morphed.x, vertex.y, morphed.y, vertex.w); // for testing
  //return vec4(morphed.x, morphed.y, vertex.z, vertex.w); // correct

  //vertex.z += morphK * 2.0 + float(lod) * 2.0; // for testing distance line and continuity
  //return vertex;
}

void main()
{
  // vertex in view space
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // lod morphing, uncomment to enable morphing

  /*if(mod(coordinate.x, 2.0) == 1.0 || mod(coordinate.y, 2.0) == 1.0) {
    modelPosition = morphVertexInWorld(position, modelPosition); // TODO: add check and only morph if an odd numbered x or y coord?
  }*/

  mPosition = modelPosition.xyz;

  height = octaveNoise(modelPosition.xyz) * 1.0; // set to 0.0 to examine mesh lod without terrain
  modelPosition.y += height * heightAdjust;

  vec4 ecPosition = viewMatrix * modelPosition;
  vec3 ecPosition3 = ecPosition.xyz;

  // normal in view space
  vec3 tnorm = normalize(normalMatrix * normal);

  // unit vector toward viewer from vector in view space
  vec3 viewVec = normalize(-ecPosition3);

  lightIntensity = 0.0;
  for(int l = 0; l < MAX_POINT_LIGHTS; l++) {
    // light position in view space (it was already in worldspace, so no model transform not applied)
    vec4 lightPosition = viewMatrix * vec4( pointLightPosition[l], 1.0 );
    vec3 lightPosition3 = lightPosition.xyz;

    vec3 lightColor = pointLightColor[l];
    float maxLightDistance = pointLightDistance[l];

    vec3 positionLightVector = lightPosition3-ecPosition3;

    float distanceToLight = length(positionLightVector);

    if(distanceToLight <= maxLightDistance) { // if the light is in range
      //float attenuation = 1.0 / (distanceToLight * distanceToLight);
      vec3 lightVec = normalize(positionLightVector);
      //vec3 reflectVec = reflect(-lightVec, tnorm); // for specular
      float diffuse = dot(lightVec, tnorm) * length(lightColor); // * attenuation;
      lightIntensity += max(diffuse, 0.0);
    }
  }

  gl_Position = projectionMatrix * ecPosition;

}
