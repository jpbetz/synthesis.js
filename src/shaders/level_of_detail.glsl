struct LevelOfDetailGrid {
  vec2 quadScale;
  float gridDimension;
  float range;
};

float findMorphK(float distance, float lodRange) {
  float morphStart = 0.8*lodRange;
  float morphEnd = 0.95*lodRange;
  return clamp((distance-morphStart)/(morphEnd-morphStart), 0.0, 1.0);
}

// morphs input vertex uv from high to low detailed mesh position
// - gridPos: normalized [0, 1] .xy grid position of the source vertex (e.g., a (2,3) or a (4,4) would be (0.5, 0.75))
// - vertex: vertex.xy components in the world space
// - morphK: [0..1] ranges from 0 (no morph, high detail) to 1 (full morph, 4x fewer triangles)

// based on: http://www.vertexasylum.com/downloads/cdlod/cdlod_latest.pdf, but using the optimized
// code using pre-calculated grid dimension values

vec2 morphVertex(vec2 vertexWorldPosition, vec3 groundViewPosition, vec2 vertexGridCoordinate, LevelOfDetailGrid lodGrid) {
  float distance = length(groundViewPosition);
  float morphLerpK = findMorphK(distance, lodGrid.range);

  // TODO:  !!!! had to use .yx here because my planes are upside down so the coordinates are inverted... ugh!!!
  vec2 fracPart = fract(vertexGridCoordinate.yx * 0.5) * 2.0/lodGrid.gridDimension;

  // TODO:  why does *gridDimension scale things correctly here?
  return vertexWorldPosition - (fracPart * lodGrid.quadScale.xy*lodGrid.gridDimension * morphLerpK);
}

vec4 morphVertexInWorld(vec4 vertexWorldPosition, vec2 vertexGridCoordinate, mat4 viewMatrix, LevelOfDetailGrid lodGrid) {
  if(mod(vertexGridCoordinate.x, 2.0) == 1.0 || mod(vertexGridCoordinate.y, 2.0) == 1.0) {
    vec4 groundWorldPosition = vec4(vertexWorldPosition.x, 0.0, vertexWorldPosition.z, vertexWorldPosition.w);
    vec3 groundViewPosition = (viewMatrix * groundWorldPosition).xyz;
    vec2 morphed = morphVertex(vertexWorldPosition.xz, groundViewPosition, vertexGridCoordinate, lodGrid);
    return vec4(morphed.x, vertexWorldPosition.y, morphed.y, vertexWorldPosition.w);
  } else {
    return vertexWorldPosition;
  }
}