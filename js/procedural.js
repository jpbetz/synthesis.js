/**
 * '[' - push
 * ']' - pop
 * '&', '^' - pitch (clockwise, counter-clockwise)
 * '+', '-' - yaw (clockwise, counter-clockwise)
 * '\', '/' - roll (clockwise, counter-clockwise)
 * '|' - reverse
 */
var LSystem = {};
LSystem.derive = function(n, axiom, rules) {
  var predecessor = axiom;
  var successor;
  for(var i = 0; i < n; i++) {
    successor = "";
    for (var pos = 0; pos < predecessor.length; pos++) {
        var c = predecessor.charAt(pos);
        if(c in rules) {
             rule = rules[c];
             if(typeof rule === 'object') { // we've got a stocastic rule
                var randomValue = Math.random();
                var lowerBound = 0;
                for (var ruleIdx = 0; ruleIdx < rule.length; ruleIdx++) {
                  var occurance = rule[ruleIdx];
                  var occuranceOdds = parseFloat(occurance['odds']);
                  var occuranceSuccessor = occurance['successor'];
                  if(randomValue < lowerBound + occuranceOdds) {
                    successor += occuranceSuccessor;
                    break;
                  }
                  lowerBound += occuranceOdds;
                }
             } else { // have a simple, deterministic rule
               successor += rule;
             }
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

/**
 * Parameters:
 * angle - angle of rotation for angle changing operation: pitch, roll, yaw
 * length - length of branches
 * depthSizeRatio - relative size of each depth of rendered object w/r/t the previous depth,  e.g. 0.95 would result in each depth being 5% smaller
 * branchMaterial - THREE.Material use to render branches
 * leafMaterial - THREE.Material use to render leaves
 */
LSystem.interpret = function(derivation, parameters) {
  var defaultBranchMaterial = new THREE.MeshPhongMaterial( { ambient: 0xffaa66, color: 0xffaa66, specular: 0x050505 } );
  var defaultLeafMaterial = new THREE.MeshPhongMaterial( { ambient: 0x33cc33, color: 0x33cc33, specular: 0x050505 } );

  parameters = parameters || {};
  var branchAngle = parameters.branchAngle !== undefined ? parameters.branchAngle : 0.1*Math.PI;
  var branchLength = parameters.branchLength !== undefined ? parameters.branchLength : 3;
  var branchThickness = parameters.branchThickness !== undefined ? parameters.branchThickness : 0.3;
  var leafSize = parameters.leafSize !== undefined ? parameters.leafSize : 0.3;
  var depthSizeRatio = parameters.depthSizeRatio !== undefined ? parameters.depthSizeRatio : 0.90;
  var branchMaterial = parameters.branchMaterial !== undefined ? parameters.branchMaterial : defaultBranchMaterial;
  var leafMaterial = parameters.leafMaterial !== undefined ? parameters.leafMaterial : defaultLeafMaterial;
  var angleVariation = parameters.angleVariation !== undefined ? parameters.angleVariation : 0.50;
  var sizeVariation = parameters.sizeVariation !== undefined ? parameters.sizeVariation : 0.25;
  var sidesPerMesh = parameters.sidesPerMesh !== undefined ? parameters.sidesPerMesh : 16;

  var root = new THREE.Object3D();
  root.rotation.y = Math.random()*Math.PI*2;

  var stack = []; // elements are {"position": <Vector3>, "rotation": <Quaternion> }
  var current = {
    "position": new THREE.Vector3(0, 0, 0),
    "rotation": new THREE.Quaternion(0, 0, 0, 1),
    "branchLength": branchLength,
    "branchThickness": branchThickness,
    "branchAngle": branchAngle,
    "leafSize": leafSize
  };

  for(var i = 0; i < derivation.length; i++) {
    var c = derivation.charAt(i);
    switch(c) {
      case 'F':
        var nextBranchThickness = current.branchThickness*depthSizeRatio - Math.random()*(current.branchThickness*sizeVariation);
        var branchGeometry = new THREE.CylinderGeometry(nextBranchThickness, current.branchThickness, current.branchLength, sidesPerMesh);
        var branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);

        branchMesh.position.add(new THREE.Vector3(0, current.branchLength/2, 0));
        var branch = new THREE.Object3D();

        branch.add(branchMesh);

        var axisGeometry = new THREE.SphereGeometry(current.branchThickness, sidesPerMesh, sidesPerMesh);
        var axisMesh = new THREE.Mesh(axisGeometry, branchMaterial);

        branch.add(axisMesh);

        branch.position.add(current.position);
        branch.quaternion.multiply(current.rotation);
        root.add(branch);
        var forward = new THREE.Vector3(0, current.branchLength, 0);
        current.position.add(forward.applyQuaternion(current.rotation));

        current.branchLength = current.branchLength*depthSizeRatio - Math.random()*(current.branchLength*sizeVariation);
        current.branchThickness = nextBranchThickness;
        current.branchAngle = current.branchAngle + (Math.random()-0.5)*(current.branchAngle*angleVariation);
        current.leafSize = current.leafSize*depthSizeRatio - Math.random()*(current.leafSize*sizeVariation);

        break;
      case 'L':
        if(derivation.charAt(i-1) != ']') {
          var leafGeometry = new THREE.SphereGeometry(current.leafSize, sidesPerMesh, sidesPerMesh);
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
          "branchLength": current.branchLength,
          "branchThickness": current.branchThickness,
          "branchAngle": current.branchAngle,
          "leafSize": current.leafSize
        });
        break;
      case ']':
        current = stack.pop();
        break;
      case '&':
        var pitchCW = new THREE.Quaternion();
        pitchCW.setFromAxisAngle(new THREE.Vector3(1, 0, 0), current.branchAngle);
        current.rotation = current.rotation.multiply(pitchCW);
        break;
      case '^':
        var pitchCCW = new THREE.Quaternion();
        pitchCCW.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), current.branchAngle);
        current.rotation = current.rotation.multiply(pitchCCW);
        break;
      case '+':
        var yawCW = new THREE.Quaternion();
        yawCW.setFromAxisAngle(new THREE.Vector3(0, 0, 1), current.branchAngle);
        current.rotation = current.rotation.multiply(yawCW);
        break;
      case '-':
        var yawCCW = new THREE.Quaternion();
        yawCCW.setFromAxisAngle(new THREE.Vector3(0, 0, -1), current.branchAngle);
        current.rotation = current.rotation.multiply(yawCCW);
        break;
      case '\\':
        var rollCW = new THREE.Quaternion();
        rollCW.setFromAxisAngle(new THREE.Vector3(0, 1, 0), current.branchAngle);
        current.rotation = current.rotation.multiply(rollCW);
        break;
      case '/':
        var rollCCW = new THREE.Quaternion();
        rollCCW.setFromAxisAngle(new THREE.Vector3(0, -1, 0), current.branchAngle);
        current.rotation = current.rotation.multiply(rollCCW);
        break;
      case '|':
        var reverse = new THREE.Quaternion(180, 180, 0, 1);
        current.rotation = current.rotation.multiply(reverse);
        break;
    }
  }
  return root;
}
