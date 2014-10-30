TerrainRenderer = function(tileSize, levelsOfDetail, gridDimension) {
  this.tileSize = tileSize === undefined ? 1 : tileSize;
  this.levelsOfDetail = levelsOfDetail === undefined ? 5 : levelsOfDetail;
  this.gridDimension = gridDimension === undefined ? 64 : gridDimension;
  this.geometry = new THREE.PlaneGeometry(1, 1, gridDimension, gridDimension);

  this.ranges = [];
  this.materials = [];
  var rangeSum = 0;
  for(var lod = 0; lod <= this.levelsOfDetail; lod++) {
    var lodMultiplier = Math.pow(2, lod);
    rangeSum += tileSize*lodMultiplier;
    this.ranges.push(rangeSum);

    var gridDimensionHalf = this.gridDimension/2;

    var quadSize = tileSize*lodMultiplier/this.gridDimension;

    var material = new ShaderNoiseMaterial({
      octaves: 8,
      sampleScale: new THREE.Vector3(0.001, 0.001, 0.001),
      heightAdjust: 300,
      quadScale: new THREE.Vector2(quadSize, quadSize),
      lod: lod,
      lodRange: rangeSum,
      miscGridDimensions: new THREE.Vector3(this.gridDimension, gridDimensionHalf, 1/gridDimensionHalf)
    });
    this.materials.push(material);
  }

  var largestLodMultiplier = Math.pow(2, levelsOfDetail);

  var bottomLeft = new THREE.Vector3(-tileSize*largestLodMultiplier/2, 0, -tileSize*largestLodMultiplier/2);
  var topRight = new THREE.Vector3(tileSize*largestLodMultiplier/2, 0, tileSize*largestLodMultiplier/2);
  var box = new THREE.Box3(bottomLeft, topRight);
  this.quadTree = new QuadNode(box);
  this.quadTree.subdivide(levelsOfDetail);
};

TerrainRenderer.prototype = {
  generateLodPlane: function(cameraPosition, frustum) {
    var selections = this.quadTree.lodSelect(this.ranges, this.levelsOfDetail, cameraPosition, frustum);

    var lodPlane = new THREE.Object3D();
    for (var i = 0; i < selections.length; i++) {
      var selection = selections[i];
      var size = selection.box.size();

      var material = this.materials[selection.lod];
      var mesh = new THREE.Mesh(this.geometry, material);
      mesh.scale.set(size.x, size.z, 1);

      mesh.position.add(new THREE.Vector3(selection.box.min.x + size.x/2, 0, selection.box.min.z + size.z/2));
      //console.log("Adding LOD mesh: { size: { x: " + size.x + ", y: " + size.y + ", z: " + size.z + "}, position: { x: " + mesh.position.x + ", y: " + mesh.position.y + ", z: " + mesh.position.z + "}}");
      mesh.rotateX(-Math.PI/2);
      lodPlane.add(mesh);
    }

    return lodPlane;
  }
};
