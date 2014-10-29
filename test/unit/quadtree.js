QUnit.test("QuadTree Tests", function() {
  var assertFloatEqual = function (x, y, decimalPlaces) {
    assert.equal(typeof x, "number", "x must be a number, but was: " + x);
    assert.equal(typeof y, "number", "y must be a number, but was: " + y);
    assert.equal(typeof decimalPlaces, "number", "decimalPlaces must be a number, but was: " + decimalPlaces);
    var multiplier = Math.pow(10, decimalPlaces);
    assert.equal(Math.round(x*multiplier)/multiplier, Math.round(y*multiplier)/multiplier);
  };

  var quadTree = new QuadNode(new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 1)));
  quadTree.subdivide(2);

  assert.equal(quadTree.children.length, 4);
  for(var i = 0; i < 4; i++) {
    var child = quadTree.children[i];
    assert.equal(child.children.length, 4);
  }

  var ranges = [0.1, 0.2, 0.4];

  // setup a frustum
  var camera = new THREE.PerspectiveCamera();
  camera.position.add(new THREE.Vector3(-1, -1, 0));
  camera.lookAt(new THREE.Vector3(1, 1, 0));
  camera.updateMatrix();
  camera.updateMatrixWorld();
  camera.matrixWorldInverse.getInverse(camera.matrixWorld);
  var frustum = new THREE.Frustum();
  frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

  assert.equal(frustum.intersectsBox(new THREE.Box3(new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1))), true);

  var selection = quadTree.lodSelect(ranges, 2, camera.position, frustum);
  console.log("\nselection:");
  for(i = 0; i < selection.length; i++) {
    var item = selection[i];
    console.log("{ lod: " + item.lod + ", box: { min: { x: " + item.box.min.x + ", y: " + item.box.min.y + ", z: 0}, max: { x: " + item.box.max.x + ", y: " + item.box.max.y + ", z: 0 }}}");
  }
  /*assert.equal(selection[0], { lod: 0, box: { min: { x: 0, y: 0, z: 0 }, max: { x: 0.25, y: 0.25, z: 0 }}});
  assert.equal(selection[1], { lod: 1, box: { min: { x: 0, y: 0.25, z: 0}, max: { x: 0.25, y: 0.5, z: 0 }}});
  assert.equal(selection[2], { lod: 1, box: { min: { x: 0.25, y: 0, z: 0}, max: { x: 0.5, y: 0.25, z: 0 }}});
  assert.equal(selection[3], { lod: 1, box: { min: { x: 0.25, y: 0.25, z: 0}, max: { x: 0.5, y: 0.5, z: 0 }}});
  assert.equal(selection[4], { lod: 2, box: { min: { x: 0, y: 0.5, z: 0}, max: { x: 0.5, y: 1, z: 0 }}});
  assert.equal(selection[5], { lod: 2, box: { min: { x: 0.5, y: 0, z: 0}, max: { x: 1, y: 0.5, z: 0 }}});
  assert.equal(selection[6], { lod: 2, box: { min: { x: 0.5, y: 0.5, z: 0}, max: { x: 1, y: 1, z: 0 }}});*/
});
