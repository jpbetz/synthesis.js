NoiseTexture = function(width, height, params) {
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

  var noiseArray = new Uint8Array(width*height*3);
  var simplex = new Simplex();

  for(var u = 0; u < width; u++) {
    for(var v = 0; v < height; v++) {
      var index = (u+v*width)*3;
      var sampleValue = simplex.getOctaveNoise(+(u*sampleMultiplier), y+(v*sampleMultiplier), z, pOctaves);
      var color = gradient.colorAtX(sampleValue);
      noiseArray[index + 0] = color.r*255;
      noiseArray[index + 1] = color.g*255;
      noiseArray[index + 2] = color.b*255;
    }
  }

  THREE.DataTexture.call(this, noiseArray, width, height, THREE.RGBFormat);
  this.needsUpdate = true;
};

NoiseTexture.prototype = Object.create( THREE.DataTexture.prototype );

NoiseTexture.prototype.clone = function () {
	var texture = new NoiseTexture(width, height, params);
	THREE.DataTexture.prototype.clone.call( this, texture );
	return texture;
};
