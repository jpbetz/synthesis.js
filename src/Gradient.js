Gradient = function(gradientPoints) {
  this.gradientPoints = gradientPoints;
};

Gradient.prototype = {
  unassigned: new THREE.Color(0xffffff),

  colorAtX: function(x) {
    for (var i = 0; i < this.gradientPoints.length-1; i++) {
      var lower = this.gradientPoints[i];
      var upper = this.gradientPoints[i+1];
      if(x >= lower.x && x <= upper.x) {
        var result = upper.color.clone();
        return result.lerp(lower.color, (upper.x-x)/(upper.x-lower.x));
      }
    }
    return unassigned;
  }
};
