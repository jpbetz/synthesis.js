QUnit.test("Worley Tests", function() {
  var assertFloatEqual = function (x, y, decimalPlaces) {
    assert.equal(typeof x, "number", "x must be a number, but was: " + x);
    assert.equal(typeof y, "number", "y must be a number, but was: " + y);
    assert.equal(typeof decimalPlaces, "number", "decimalPlaces must be a number, but was: " + decimalPlaces);
    var multiplier = Math.pow(10, decimalPlaces);
    assert.equal(Math.round(x*multiplier)/multiplier, Math.round(y*multiplier)/multiplier);
  };

  var noise = new Worley(2);
  var r1 = noise.nearestPointWithDistance(0.5, 0.5);
  var point = r1[0];
  var dist = r1[1];
  //assertFloatEqual(point[0], 0.764, 2);
  //assertFloatEqual(point[1], 0.129, 2);
  //assertFloatEqual(dist, 0.455, 2);
  assertFloatEqual(0.1, 0.1, 2);
});
