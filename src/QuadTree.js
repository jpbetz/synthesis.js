/**
 * Provides:
 *   - view frustum culling of terrain data.
 *   - Level of detail (LOD)
 */

/**
 * box - a Three.js Box3,  where x and z bound the 2d box, y is zero
 * children - optional.  An array of 4 child elements.
 */
QuadNode = function(box, children) {
  this.boundingBox = box;
  if(this.boundingBox.min.y !== 0) throw "for box.min, y must be 0,  use x and z to bound the terrain.";
  if(this.boundingBox.max.y !== 0) throw "for box.max, y must be 0,  use x and z to bound the terrain.";

  if(children !== undefined) {
    this.children = children;
  }
};

QuadNode.prototype = {

  subdivide: function(depth) {
    if(depth === undefined) depth = 1;

    if(this.children) {
      throw "QuadNode already subdivided, cannot subdivide again.";
    }
    var min = this.boundingBox.min;
    var max = this.boundingBox.max;
    var mid = new THREE.Vector3(
      min.x + (max.x-min.x)/2,
      0,
      min.z + (max.z-min.z)/2
    );

    var x1z1 = new QuadNode(new THREE.Box3(min, new THREE.Vector3(mid.x, 0, mid.z)));
    var x1z2 = new QuadNode(new THREE.Box3(new THREE.Vector3(min.x, 0, mid.z), new THREE.Vector3(mid.x, 0, max.z)));
    var x2z1 = new QuadNode(new THREE.Box3(new THREE.Vector3(mid.x, 0, min.z), new THREE.Vector3(max.x, 0, mid.z)));
    var x2z2 = new QuadNode(new THREE.Box3(new THREE.Vector3(mid.x, 0, mid.z), max));

    this.children = [x1z1, x1z2, x2z1, x2z2];
    if(depth > 1) {
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        child.subdivide(depth-1);
      }
    }
  },

  /**
   * LOD level 0 is the highest detail level.
   *
   * ranges - array of lod view distance ranges.  e.g.
   * lodLevel - the level to start selection from.
   * frustum - a THREE.Frustum.  the view fustrum to cull the data to
   */
  lodSelect: function(ranges, lodLevel, cameraPos, frustum) {
    var selection = [];
    this.lodSelectAcc(ranges, lodLevel, cameraPos, frustum, selection);
    return selection;
  },

  lodSelectAcc: function(ranges, lodLevel, cameraPos, frustum, selection) {
    var distanceToPoint = this.boundingBox.distanceToPoint(cameraPos);
    if(distanceToPoint >= ranges[lodLevel]) {
      return false; // no node or child nodes were selected, parent should handle area
    }
    if(!frustum.intersectsBox(this.boundingBox)) {
      return true; // nothing intersects, but was in range
    }
    if(lodLevel === 0) {
      // add whole node to selected list
      selection.push({ box: this.boundingBox, lod: lodLevel });
      return true;
    }
    else {
      if(distanceToPoint < ranges[lodLevel-1])  {
        for (var i = 0; i < this.children.length; i++) {
          var child = this.children[i];
          if(!child.lodSelectAcc(ranges, lodLevel-1, cameraPos, frustum, selection)) {
            // child was not in range for higher LOD, add child node's bounding box
            // to selection list at current node's LOD
            //selection.push({ box: child.boundingBox, lod: lodLevel });
            selection.push({ box: child.boundingBox, lod: lodLevel-1 }); // TODO: review this change,  is it really correct to add box at lodLevel-1 ?
          }
        }
      }
      else {
        // add whole node to selected list
        selection.push({ box: this.boundingBox, lod: lodLevel });
      }
      return true;
    }
  }
};
