// TODO: This is very inefficient for sampling because points are recomputed each time a cell is touched
// TODO: add 3D support
// maybe cell points should be stored?

Worley = function(averagePointsPerCell, distanceMeasure) {
  this.initialize(averagePointsPerCell, distanceMeasure);
};


// TODO: distance measures to implement:
// Chebyshev
// quadratic
// weighted?
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

  distanceToNthPoint: function(evalPointX, evalPointY, n) {
    var results = this.nearestPointsWithDistance(evalPointX, evalPointY, n);
    var nthPoint = results[n-1];
    return nthPoint;
  },

  // TODO: return the id of the nearest feature point,  can just be something like 9*((x*y)+x)+pointCountInCell
  nearestPointsWithDistance: function(evalPointX, evalPointY, pointCount) {
    var cubeX = Math.floor(evalPointX);
    var cubeY = Math.floor(evalPointY);

    // TODO: optimize by checking if the neighboring cell could possibly have any closer feature points before
    // calculating the points
    var matches = [];
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        var neighborX = cubeX + i;
        var neighborY = cubeY + j;
        var seed = (neighborX * neighborY) + neighborX;
        var randomizer = new Random(seed);

        // compare r1 to the poisson distribution, determine how many points are in cell,
        // clamped between 1 and 9
        var poissonSampledValue = randomizer.poisson(this.averagePointsPerCell);
        var pointsInCell = this.clamp(Math.round(poissonSampledValue), 1, 9);
        for (var pid = 0; pid < pointsInCell; pid++) {
          var featurePointX = neighborX + randomizer.uniform(0, 1);
          var featurePointY = neighborY + randomizer.uniform(0, 1);
          //var id = 9*neighborY*neighborX*pid;
          var dist = this.distanceMeasure(evalPointX, evalPointY, featurePointX, featurePointY);
          if(matches.length < pointCount || dist < matches[matches.length-1]) {
            matches.push(dist);
            matches.sort();
            if(matches.length > pointCount) {
              matches.pop();
            }
          }
        }
      }
    }
    return matches;
  },

  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
};
