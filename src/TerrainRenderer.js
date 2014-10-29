TerrainRenderer = function(tileSize, levelsOfDetail, material) {
  this.tileSize = tileSize === undefined ? 1 : tileSize;
  this.levelsOfDetail = levelsOfDetail === undefined ? 5 : levelsOfDetail;
  this.material = material;
  this.geometry = new THREE.PlaneGeometry(1, 1, 64, 64 ); // TODO: make resolution configurable

  this.ranges = [];
  this.rangeMaterials = [];
  for(var lod = 0; lod <= this.levelsOfDetail; lod++) {
    var lodMultiplier = Math.pow(2, lod);
    this.ranges.push(tileSize*lodMultiplier);

    var colorVal = 1-(lod*0.1);
    var rangeColor = new THREE.Color(colorVal, colorVal, colorVal);
    this.rangeMaterials.push(new THREE.MeshPhongMaterial( { ambient: rangeColor, color: rangeColor, specular: 0x050505 } ));
  }

  var fullSize = Math.pow(2, levelsOfDetail);

  var bottomLeft = new THREE.Vector3(-tileSize*fullSize/2, 0, -tileSize*fullSize/2);
  var topRight = new THREE.Vector3(tileSize*fullSize/2, 0, tileSize*fullSize/2);
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

      //var mesh = new THREE.Mesh(geo, this.material);
      var material = this.material !== undefined ? this.material : this.rangeMaterials[selection.lod];
      var mesh = new THREE.Mesh(this.geometry, material);
      mesh.scale.set(size.x, size.z, 1);
      //mesh.matrixAutoUpdate;

      mesh.position.add(new THREE.Vector3(selection.box.min.x + size.x/2, 0, selection.box.min.z + size.z/2));
      //console.log("Adding LOD mesh: { size: { x: " + size.x + ", y: " + size.y + ", z: " + size.z + "}, position: { x: " + mesh.position.x + ", y: " + mesh.position.y + ", z: " + mesh.position.z + "}}");
      mesh.rotateX(-Math.PI/2);
      lodPlane.add(mesh);
    }

    return lodPlane;
  }
};
