QUnit.test("Gradient Tests", function() {
  var assertSameColor = function(color1, color2) {
    assert.equal(color1.r, color2.r);
    assert.equal(color1.g, color2.g);
    assert.equal(color1.b, color2.b);
  };

  var color1 = new GradientPoint(new THREE.Color(1, 0, 0), 0);
  var color2 = new GradientPoint(new THREE.Color(0, 1, 0), 100);
  var gradient = new Gradient([color1, color2]);
  assertSameColor(gradient.colorAtX(50), new THREE.Color(0.5, 0.5, 0));
});
