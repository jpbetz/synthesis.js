var PROCEDURAL = {};
PROCEDURAL.calculateLSystemDerivation = function(n, axiom, rules) {
  var predecessor = axiom;
  var successor;
  for(var i = 0; i < n; i++) {
    successor = "";
    for (var pos = 0; pos < predecessor.length; pos++) {
        var c = predecessor.charAt(pos);
        if(c in rules) {
            successor += rules[c];
        } else {
            // it's a convention in l-systems to
            // pass-thru symbols without production
            // rules (sorta like having an implied identity
            // production rule).
            successor += c;
        }
    }
    predecessor = successor;
  }
  return successor;
};

PROCEDURAL.interpretLSystemDerivation = function(derivation) {
  var angle = Math.PI/10;
  var length = 3;
  var depthSizeRatio = 0.90;
  var branchMaterial = new THREE.MeshPhongMaterial( { ambient: 0xffaa66, color: 0xffaa66, specular: 0x050505 } );
  var leafMaterial = new THREE.MeshPhongMaterial( { ambient: 0x33cc33, color: 0x33cc33, specular: 0x050505 } );

  var root = new THREE.Object3D();

  var pitchCW = new THREE.Quaternion();
  pitchCW.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);

  var pitchCCW = new THREE.Quaternion();
  pitchCCW.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), angle);

  var rollCW = new THREE.Quaternion();
  rollCW.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

  var rollCCW = new THREE.Quaternion();
  rollCCW.setFromAxisAngle(new THREE.Vector3(0, -1, 0), angle);

  var yawCW = new THREE.Quaternion();
  yawCW.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);

  var yawCCW = new THREE.Quaternion();
  yawCCW.setFromAxisAngle(new THREE.Vector3(0, 0, -1), angle);

  var reverse = new THREE.Quaternion(180, 180, 0, 1);

  var stack = []; // elements are {"position": <Vector3>, "rotation": <Quaternion> }
  var current = {
    "position": new THREE.Vector3(0, 0, 0),
    "rotation": new THREE.Quaternion(0, 0, 0, 1),
    "size": 1
  };

  for(var i = 0; i < derivation.length; i++) {
    var c = derivation.charAt(i)
    switch(c) {
      case 'F':
        var branchGeometry = new THREE.CylinderGeometry(0.3*current.size, 0.3*current.size, length*current.size, 16);
        var branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);

        branchMesh.position.add(new THREE.Vector3(0,length*current.size/2,0));
        var branch = new THREE.Object3D();
        branch.add(branchMesh);

        branch.position.add(current.position);
        branch.quaternion.multiply(current.rotation);
        root.add(branch);
        var forward = new THREE.Vector3(0,length*current.size,0);
        current.position.add(forward.applyQuaternion(current.rotation));
        break;
      case 'L':
        if(derivation.charAt(i-1) != ']') {
          var leafGeometry = new THREE.SphereGeometry(current.size, 16, 16);
          var leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);

          var leaf = new THREE.Object3D();
          leaf.add(leafMesh);

          leaf.position.add(current.position);
          leaf.quaternion.multiply(current.rotation);
          root.add(leaf);
        }
        break;
      case '[':
        stack.push({
          "position": current.position.clone(),
          "rotation": current.rotation.clone(),
          "size": current.size * depthSizeRatio
        });
        break;
      case ']':
        current = stack.pop();
        break;
      case '&':
        current.rotation = current.rotation.multiply(pitchCW);
        break;
      case '^':
        current.rotation = current.rotation.multiply(pitchCCW);
        break;
      case '+':
        current.rotation = current.rotation.multiply(yawCW);
        break;
      case '-':
        current.rotation = current.rotation.multiply(yawCCW);
        break;
      case '\\':
        current.rotation = current.rotation.multiply(rollCW);
        break;
      case '/':
        current.rotation = current.rotation.multiply(rollCCW);
        break;
      case '|':
        current.rotation = current.rotation.multiply(reverse);
        break;
    }
  }
  return root;
}
