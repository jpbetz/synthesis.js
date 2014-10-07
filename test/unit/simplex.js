QUnit.test("Simplex Tests", function() {
  var assertFloatEqual = function (x, y, decimalPlaces) {
    assert.equal(typeof x, "number", "x must be a number, but was: " + x);
    assert.equal(typeof y, "number", "y must be a number, but was: " + y);
    assert.equal(typeof decimalPlaces, "number", "decimalPlaces must be a number, but was: " + decimalPlaces);
    var multiplier = Math.pow(10, decimalPlaces);
    assert.equal(Math.round(x*multiplier)/multiplier, Math.round(y*multiplier)/multiplier);
  };

  var noise = new Simplex();
  assertFloatEqual(noise.dot([0.1, 0.2, 0.3], 2, 2, 2), 1.2, 3);

  assertFloatEqual(noise.getNoise(0.5,0.5,0.5), 0.5, 3);
});
