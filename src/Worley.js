// TODO: This is very inefficient for sampling because points are recomputed each time a cell is touched
// TODO: add 3D support
// maybe cell points should be stored?

Worley = function(averagePointsPerCell, distanceMeasure) {
  this.initialize(averagePointsPerCell, distanceMeasure);
};

Worley.EUCLIDIAN = function(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
};

Worley.MANHATTAN = function(x1, y1, x2, y2) {
  return Math.abs(x1-x2) + Math.abs(y1-y2);
};

// cube width and height are always 1,  averagePointsPerCell can be adjusted
Worley.prototype = {

  distanceMeasure: function() {},

  averagePointsPerCell: 1,

  initialize: function(averagePointsPerCell, distanceMeasure) {
    this.averagePointsPerCell = averagePointsPerCell;

    if(distanceMeasure !== undefined) {
      this.distanceMeasure = distanceMeasure;
    } else {
      this.distanceMeasure = Worley.EUCLIDIAN;
    }
  },

  // TODO: distance measures to implement:
  // euclidean
  // city block
  // manhattan
  // Chebyshev
  // quadratic
  // weighted?

  // TODO: add support for returning N nearest points (or just Nth nearest point)
  // TODO: return the id of the nearest feature point,  can just be something like 9*((x*y)+x)+pointCountInCell
  nearestPointWithDistance: function(evalPointX, evalPointY) {
    var cubeX = Math.floor(evalPointX);
    var cubeY = Math.floor(evalPointY);

    // TODO: optimize by checking if the neighboring cell could possibly have any closer feature points before
    // calculating the points
    var nearestAndDistance = [[-1, -1], Infinity];
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        var pointAndDistance = this.nearestPointInCell(cubeX+i, cubeY+j, evalPointX, evalPointY);
        if(pointAndDistance[1] < nearestAndDistance[1]) {
          nearestAndDistance = pointAndDistance;
        }
      }
    }
    return nearestAndDistance;
  },

  nearestPointInCell: function(cubeX, cubeY, evalPointX, evalPointY) {
    var seed = this.hash((cubeX*cubeY)+cubeX);
    var randomizer = new Random(seed);

    // compare r1 to the poisson distribution, determine how many points are in cell,
    // clamped between 1 and 9
    var poissonSampledValue = randomizer.poisson(this.averagePointsPerCell);
    var pointCount = this.clamp(Math.round(poissonSampledValue), 1, 9);

    var nearestAndDistance = [[-1, -1], Infinity];
    for (var i = 0; i < pointCount; i++) {
      var featurePointX = cubeX + randomizer.uniform(0, 1);
      var featurePointY = cubeY + randomizer.uniform(0, 1);
      var dist = this.distanceMeasure(evalPointX, evalPointY, featurePointX, featurePointY);
      if(dist < nearestAndDistance[1]) {
        nearestAndDistance = [[featurePointX, featurePointY], dist];
      }
    }
    return nearestAndDistance;
  },

  hash: function(i) {
    return i; // TODO: need a real hash function here?
  },

  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
};
