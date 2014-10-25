/**
 * Worley noise generator.
 * Features:
 *  - 2D and 3D noise
 *  - Nth nearest point support, not just limited to nearest point
 *  - Able to retrieve:
 *    - distance to Nth point
 *    - coordinate of Nth point
 *    - id of Nth point
 * - Pluggable distance function,  e.g. use Manhattan distance instead of Euclidian
 *
 * jpbetz
 *
 */

Worley = function(averagePointsPerCell, distanceMeasure) {
  this.initialize(averagePointsPerCell, distanceMeasure);
};

// TODO: distance measures to implement:
// Chebyshev
// quadratic
// weighted?
Worley.EUCLIDIAN = {
  distance2D: function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
  },
  distance3D: function(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2) + Math.pow(z1-z2, 2));
  }
};

Worley.MANHATTAN = {
  distance2D: function(x1, y1, x2, y2) {
    return Math.abs(x1-x2) + Math.abs(y1-y2);
  },
  distance3D: function(x1, y1, z1, x2, y2, z2) {
    return Math.abs(x1-x2) + Math.abs(y1-y2) + Math.abs(z1-z2);
  }
};

// cube width and height are always 1,  averagePointsPerCell can be adjusted
Worley.prototype = {

  initialize: function(averagePointsPerCell, distanceMeasure) {
    if (averagePointsPerCell !== undefined) {
      this.averagePointsPerCell = averagePointsPerCell;
    }

    if(distanceMeasure === undefined) {
      this.distanceMeasure = Worley.EUCLIDIAN.distance2D;
      this.distanceMeasure3D = Worley.EUCLIDIAN.distance3D;
    } else {
      this.distanceMeasure = distanceMeasure.distance2D;
      this.distanceMeasure3D = distanceMeasure.distance3D;
    }
  },

  distanceToNthPoint: function(evalPointX, evalPointY, n) {
    var results = this.nNearest(evalPointX, evalPointY, n);
    var nthPoint = results[n-1];
    return nthPoint[0];
  },

  nthPoint: function(evalPointX, evalPointY, n) {
    var results = this.nNearest(evalPointX, evalPointY, n);
    var nthPoint = results[n-1];
    return [nthPoint[1], nthPoint[2]];
  },

  nthPointId: function(evalPointX, evalPointY, n) {
    var results = this.nNearest(evalPointX, evalPointY, n);
    var nthPoint = results[n-1];
    return nthPoint[1] + '-' + nthPoint[2];
  },

  distanceToNthPoint3D: function(evalPointX, evalPointY, evalPointZ, n) {
    var results = this.nNearest3D(evalPointX, evalPointY, evalPointZ, n);
    var nthPoint = results[n-1];
    return nthPoint[0];
  },

  nthPoint3D: function(evalPointX, evalPointY, evalPointZ, n) {
    var results = this.nNearest3D(evalPointX, evalPointY, evalPointZ, n);
    var nthPoint = results[n-1];
    return [nthPoint[1], nthPoint[2], nthPoint[3]];
  },

  nthPointId3D: function(evalPointX, evalPointY, evalPointZ, n) {
    var results = this.nNearest3D(evalPointX, evalPointY, evalPointZ, n);
    var nthPoint = results[n-1];
    return nthPoint[1] + '-' + nthPoint[2] + '-' + nthPoint[3];
  },

  // private

  pointDistComparitor: function(p1, p2) { return p1[0] > p2[0]; },

  nNearest: function(evalPointX, evalPointY, n) {
    var cubeX = Math.floor(evalPointX);
    var cubeY = Math.floor(evalPointY);

    // TODO: optimize by checking if the neighboring cell could possibly have any closer feature points before
    // calculating the points
    var matches = [];
    this.accumulate(evalPointX, evalPointY, cubeX, cubeY, matches, n);
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if(!(i === 0 && j === 0)) {
          this.accumulate(evalPointX, evalPointY, cubeX + i, cubeY + j, matches, n);
        }
      }
    }
    return matches;
  },

  accumulate: function(evalPointX, evalPointY, neighborX, neighborY, matches, n) {
    var seed = (neighborX * neighborY) + neighborX;
    var cubeRandom = new Random(seed);

    // compare r1 to the poisson distribution, determine how many points are in cell,
    // clamped between 1 and 9
    var poissonSampledValue = cubeRandom.poisson(this.averagePointsPerCell);
    var pointsInCell = this.clamp(Math.round(poissonSampledValue), 1, 9);
    for (var pid = 0; pid < pointsInCell; pid++) {
      var featurePointX = neighborX + cubeRandom.uniform(0, 1);
      var featurePointY = neighborY + cubeRandom.uniform(0, 1);
      var dist = this.distanceMeasure(evalPointX, evalPointY, featurePointX, featurePointY);
      if(matches.length < n || dist < matches[matches.length-1][0]) {
        matches.push([dist, featurePointX, featurePointY]);
        matches.sort(this.pointDistComparitor);
        if(matches.length > n) {
          matches.pop();
        }
      }
    }
  },

  nNearest3D: function(evalPointX, evalPointY, evalPointZ, n) {
    var cubeX = Math.floor(evalPointX);
    var cubeY = Math.floor(evalPointY);
    var cubeZ = Math.floor(evalPointZ);

    // TODO: optimize by checking if the neighboring cell could possibly have any closer feature points before
    // calculating the points
    var matches = [];
    this.accumulate3D(evalPointX, evalPointY, evalPointZ, cubeX, cubeY, cubeZ, matches, n);
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        for (var k = -1; k <= 1; k++) {
          if(!(i === 0 && j === 0 && k === 0)) {
            this.accumulate3D(evalPointX, evalPointY, evalPointZ, cubeX + i, cubeY + j, cubeZ + k, matches, n);
          }
        }
      }
    }
    return matches;
  },

  accumulate3D: function(evalPointX, evalPointY, evalPointZ, neighborX, neighborY, neighborZ, matches, n) {
    var seed = (neighborX * neighborY * neighborZ) + (neighborX * neighborY) + neighborX;
    var cubeRandom = new Random(seed);

    // compare r1 to the poisson distribution, determine how many points are in cell,
    // clamped between 1 and 9
    var poissonSampledValue = cubeRandom.poisson(this.averagePointsPerCell);
    var pointsInCell = this.clamp(Math.round(poissonSampledValue), 1, 9);
    for (var pid = 0; pid < pointsInCell; pid++) {
      var featurePointX = neighborX + cubeRandom.uniform(0, 1);
      var featurePointY = neighborY + cubeRandom.uniform(0, 1);
      var featurePointZ = neighborZ + cubeRandom.uniform(0, 1);
      var dist = this.distanceMeasure3D(evalPointX, evalPointY, evalPointZ, featurePointX, featurePointY, featurePointZ);
      if(matches.length < n || dist < matches[matches.length-1][0]) {
        matches.push([dist, featurePointX, featurePointY, featurePointZ]);
        matches.sort(this.pointDistComparitor);
        if(matches.length > n) {
          matches.pop();
        }
      }
    }
  },

  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
};
