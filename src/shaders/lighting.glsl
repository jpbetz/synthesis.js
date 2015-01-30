// TODO: add attenuation
// TODO: use colors
// TODO: add specularity

struct PointLight {
  vec3 worldPosition;
  vec3 color;
  float maxDistance;
};

float applyPointLight(mat4 viewMatrix, vec3 vertexViewPosition, vec3 vertexViewNormal, PointLight pointLight) {

  vec3 pointLightViewPosition = (viewMatrix * vec4(pointLight.worldPosition, 1.0)).xyz;
  vec3 vertexToLight = pointLightViewPosition-vertexViewPosition;
  float distanceToLight = length(vertexToLight);

  if(distanceToLight <= pointLight.maxDistance) { // if the light is in range
    //float attenuation = 1.0 / (distanceToLight * distanceToLight);
    vec3 vertexToLightNormal = normalize(vertexToLight);
    float diffuse = dot(vertexToLightNormal, vertexViewNormal) * length(pointLight.color); // * attenuation;
    return max(diffuse, 0.0);
  } else {
    return 0.0;
  }
}
