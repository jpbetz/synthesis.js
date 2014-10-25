varying vec3 mPosition;
varying float lightIntensity;

uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
uniform float pointLightDistance[MAX_POINT_LIGHTS];

const float SpecularContribution = 0.0;
const float DiffuseContribution = 1.0 - SpecularContribution;

void main()
{
  // vertex in view space
  vec4 ecPosition = modelViewMatrix * vec4(position, 1.0);
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

  mPosition = normalize(position);
  gl_Position = projectionMatrix * ecPosition;
}
