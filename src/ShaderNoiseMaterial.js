ShaderNoiseMaterial = function(params) {

  var vertexShader = document.getElementById('noise3D_vertex').innerHTML;
  var fragmentShader = document.getElementById('noise3D_fragment').innerHTML;

  var defaultGradient = new Gradient([
    {'x': 0, 'color': new THREE.Color(0,0,0)},
    {'x': 1, 'color': new THREE.Color(1,1,1)}
  ]);

  pOctaves = params.octaves !== undefined ? params.octaves : 5;
  gradient = params.gradient !== undefined ? params.gradient : defaultGradient;

  sampleOrigin = params.sampleOrigin !== undefined ? params.sampleOrigin : new THREE.Vector3(0,0,0);
  sampleScale = params.sampleScale !== undefined ? params.sampleScale : new THREE.Vector3(0.01, 0.01, 0.01);
  heightAdjust = params.heightAdjust !== undefined ? params.heightAdjust : 0;
  quadScale = params.quadScale !== undefined ? params.quadScale : new THREE.Vector2(1, 1);
  gridDimension = params.gridDimension !== undefined ? params.gridDimension : 64;
  lod = params.lod !== undefined ? params.lod : 0;
  lodRange = params.lodRange !== undefined ? params.lodRange : 0;

  // TODO: this could be wrong, might need to use a Float32Array
  var coordinates = [];
  for(var x = 0; x <= gridDimension; x++) {
    for(var y = 0; y <= gridDimension; y++) {
      coordinates.push(new THREE.Vector2(x, y));
    }
  }

  THREE.ShaderMaterial.call(this, {
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,
      {
        octaves: { type: "1i", value: pOctaves },
        heightAdjust: { type: "1f", value: heightAdjust },
        sampleOrigin: { type: "v3", value: sampleOrigin },
        sampleScale: { type: "v3", value: sampleScale },
        quadScale: { type: "v2", value: quadScale},
        gridDimension: { type: "1f", value: gridDimension},
        lod: { type: "1i", value: lod},
        lodRange: { type: "1f", value: lodRange}
	    }
    ]),
    attributes: {
      coordinate: { type: 'v2', value: coordinates }
    },
	  vertexShader: vertexShader,
	  fragmentShader: fragmentShader,
    lights: true,
    //wireframe: true
  });
  this.needsUpdate = true;
};

ShaderNoiseMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

ShaderNoiseMaterial.prototype.clone = function () {
  var texture = new ShaderNoiseMaterial(params);
  THREE.ShaderMaterial.prototype.clone.call( this, texture );
  return texture;
};
