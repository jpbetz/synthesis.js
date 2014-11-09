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
uniform float gridDimension;
uniform int lod;
uniform float lodRange;

attribute vec2 coordinate;

void main() {
  // vertex in view space
  vec4 vertexWorldPosition = modelMatrix * vec4(position, 1.0);

  // level of detail morphing
  LevelOfDetailGrid lodGrid = LevelOfDetailGrid(quadScale, gridDimension, lodRange);
  vertexWorldPosition = morphVertexInWorld(vertexWorldPosition, coordinate, viewMatrix, lodGrid);

  mPosition = vertexWorldPosition.xyz;

  height = octaveNoise(vertexWorldPosition.xyz, sampleOrigin, sampleScale) * 1.0; // set to 0.0 to examine mesh lod without terrain
  vertexWorldPosition.y += height * heightAdjust;

  vec3 vertexViewPosition = (viewMatrix * vertexWorldPosition).xyz;
  vec3 vertexViewNormal = normalize(normalMatrix * normal);

  lightIntensity = 0.0;
  for(int l = 0; l < MAX_POINT_LIGHTS; l++) {
    PointLight pointLight = PointLight(pointLightPosition[l], pointLightColor[l], pointLightDistance[l]);
    lightIntensity += applyPointLight(viewMatrix, vertexViewPosition, vertexViewNormal, pointLight);
  }

  gl_Position = projectionMatrix * vec4(vertexViewPosition, 1.0);
}
