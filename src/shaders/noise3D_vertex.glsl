varying vec3 mPosition;

void main()
{
  vec3 p = position;

  mPosition = normalize(position);
  vec4 pos = modelViewMatrix * vec4(mPosition, 1.0);
  gl_Position = projectionMatrix * pos;
}
