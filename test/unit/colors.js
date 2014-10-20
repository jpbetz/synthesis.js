QUnit.test("Color Conversion Tests", function() {
  var assertFloatEqual = function (x, y, decimalPlaces, reason) {
    assert.equal(typeof x, "number", "expected must be a number, but was: " + x);
    assert.equal(typeof y, "number", "result must be a number, but was: " + y);
    assert.equal(typeof decimalPlaces, "number", "decimalPlaces must be a number, but was: " + decimalPlaces);
    var multiplier = Math.pow(10, decimalPlaces);
    assert.equal(Math.round(x*multiplier)/multiplier, Math.round(y*multiplier)/multiplier, reason);
  };

  var assertSameRgb = function(color1, color2) {
    assertFloatEqual(color1.r, color2.r, 3, "r");
    assertFloatEqual(color1.g, color2.g, 3, "g");
    assertFloatEqual(color1.b, color2.b, 3, "b");
  };

  var assertSameXyz = function(color1, color2) {
    assertFloatEqual(color1.x, color2.x, 3, "x");
    assertFloatEqual(color1.y, color2.y, 3, "y");
    assertFloatEqual(color1.z, color2.z, 3, "z");
  };

  var assertSameLab = function(color1, color2) {
    assertFloatEqual(color1.l, color2.l, 3, "l");
    assertFloatEqual(color1.a, color2.a, 3, "a");
    assertFloatEqual(color1.b, color2.b, 3, "b");
  };

  var assertSameHcl = function(color1, color2) {
    assertFloatEqual(color1.h, color2.h, 3, "h");
    assertFloatEqual(color1.c, color2.c, 3, "c");
    assertFloatEqual(color1.l, color2.l, 3, "l");
  };

  var converter =  new ColorConverter();
  var rgb1 = { r: 0.5, g: 0.5, b: 0.5 };

  var xyz1 = converter.rgbToXyz(rgb1.r, rgb1.g, rgb1.b);
  assertSameRgb(converter.xyzToRgb(xyz1.x, xyz1.y, xyz1.z), rgb1);

  var lab1 = converter.xyzToLab(xyz1.x, xyz1.y, xyz1.z);
  assertSameXyz(converter.labToXyz(lab1.l, lab1.a, lab1.b), xyz1);

  var hcl1 = converter.labToHcl(lab1.l, lab1.a, lab1.b);
  assertSameLab(converter.hclToLab(hcl1.h, hcl1.c, hcl1.l), lab1);

  // test convenience conversion that combines the individual conversions
  var hcl2 = converter.rgbToHcl(rgb1.r, rgb1.g, rgb1.b);
  assertSameRgb(converter.hclToRgb(hcl1.h, hcl1.c, hcl1.l), rgb1);
});
