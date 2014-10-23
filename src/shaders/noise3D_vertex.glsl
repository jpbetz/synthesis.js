varying vec3 mPosition;
varying float lightIntensity;

uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
uniform float pointLightDistance[MAX_POINT_LIGHTS];

const float SpecularContribution = 0.0;
const float DiffuseContribution = 1.0 - SpecularContribution;

void main()
{
  vec3 ecPosition = vec3(modelViewMatrix) * position;
  vec3 tnorm = normalize(normalMatrix * normal);
  vec3 viewVec = normalize(-ecPosition);

  lightIntensity = 0.0;
  for(int l = 0; l < MAX_POINT_LIGHTS; l++) {
    vec3 lightPosition = pointLightPosition[l];
    vec3 lightColor = pointLightColor[l];
    float maxLightDistance = pointLightDistance[l];

    vec3 positionLightVector = lightPosition-ecPosition;

    float distanceToLight = length(positionLightVector);

    if(distanceToLight <= maxLightDistance) {
      //float attenuation = 1.0 / (distanceToLight * distanceToLight);
      vec3 lightVec = normalize(positionLightVector);
      //vec3 reflectVec = reflect(-lightVec, tnorm); // for specular
      float diffuse = dot(lightVec, tnorm) * length(lightColor); // * attenuation;
      lightIntensity += max(diffuse, 0.0);
    }
  }

  mPosition = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
