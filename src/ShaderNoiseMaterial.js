ShaderNoiseMaterial = function(width, height, params) {

  var vertexShader = document.getElementById('noise3D_vertex').innerHTML;
  var fragmentShader = document.getElementById('noise3D_fragment').innerHTML;

  var defaultGradient = new Gradient([
    {'x': 0, 'color': new THREE.Color(0,0,0)},
    {'x': 1, 'color': new THREE.Color(1,1,1)}
  ]);

  pOctaves = params.octaves !== undefined ? params.octaves : 5;
  sampleOrigin = params.sampleOrigin !== undefined ? params.sampleOrigin : new THREE.Vector3(0,0,0);
  sampleMultiplier = params.sampleMultiplier !== undefined ? params.sampleMultiplier : 0.05;
  gradient = params.gradient !== undefined ? params.gradient : defaultGradient;

  var x = sampleOrigin.x;
  var y = sampleOrigin.y;
  var z = sampleOrigin.z;

  THREE.ShaderMaterial.call(this, {
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,
      {
        octaves: { type: "1i", value: pOctaves },
        sampleOrigin: { type: "v3", value: sampleOrigin },
        sampleMultiplier: { type: "3fv", value: sampleMultiplier }
	    }
    ]),
	  vertexShader: vertexShader,
	  fragmentShader: fragmentShader,
    lights: true
  });
  this.needsUpdate = true;
};

ShaderNoiseMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

ShaderNoiseMaterial.prototype.clone = function () {
  var texture = new ShaderNoiseMaterial(width, height, params);
  THREE.ShaderMaterial.prototype.clone.call( this, texture );
  return texture;
};
