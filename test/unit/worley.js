QUnit.test("Worley Tests", function() {
  var assertFloatEqual = function (x, y, decimalPlaces) {
    assert.equal(typeof x, "number", "x must be a number, but was: " + x);
    assert.equal(typeof y, "number", "y must be a number, but was: " + y);
    assert.equal(typeof decimalPlaces, "number", "decimalPlaces must be a number, but was: " + decimalPlaces);
    var multiplier = Math.pow(10, decimalPlaces);
    assert.equal(Math.round(x*multiplier)/multiplier, Math.round(y*multiplier)/multiplier);
  };

  var noise = new Worley(2);
  var dist = noise.distanceToNthPoint(0.5, 0.5, 1);
  assertFloatEqual(dist, 0.23, 2);
});
