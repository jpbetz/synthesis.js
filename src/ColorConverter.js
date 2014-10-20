// based on math from http://www.brucelindbloom.com/
// also, see http://en.wikipedia.org/wiki/SRGB
// and http://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion
ColorConverter = function() {
};

ColorConverter.prototype = {
  rgbToHcl: function(r, g, b) {
    var xyz = this.rgbToXyz(r, g, b);
    var lab = this.xyzToLab(xyz.x, xyz.y, xyz.z);
    return this.labToHcl(lab.l, lab.a, lab.b);
  },

  hclToRgb: function(h, c, l) {
    var lab = this.hclToLab(h, c, l);
    var xyz = this.labToXyz(lab.l, lab.a, lab.b);
    return this.xyzToRgb(xyz.x, xyz.y, xyz.z);
  },

  rgbToXyz: function(r, g, b) {
    var sRgbInverseCompanding = function(rgb) {
      if (rgb <= 0.04045) {
        return rgb/12.92;
      } else {
        return Math.pow((rgb + 0.055)/1.055, 2.4);
      }
    };

    var vr = sRgbInverseCompanding(r);
    var vg = sRgbInverseCompanding(g);
    var vb = sRgbInverseCompanding(b);

    return {
      x: 0.4124564 * vr + 0.3575761 * vg + 0.1804375 * vb,
      y: 0.2126729 * vr + 0.7151522 * vg + 0.0721750 * vb,
      z: 0.0193339 * vr + 0.1191920 * vg + 0.9503041 * vb
    };
  },

  xyzToRgb: function(x, y, z) {
    var sRgbCompanding = function(c) {
      if (c <= 0.0031308) {
        return c*12.92;
      } else {
        return 1.055*Math.pow(c, 1/2.4)-0.055;
      }
    };

    var linearRgb = {
      r: 3.2404542  * x + -1.5371385 * y + -0.4985314 * z,
      g: -0.9692660 * x +  1.8760108 * y + 0.0415560  * z,
      b: 0.0556434  * x + -0.2040259 * y + 1.0572252  * z
    };

    return {
      r: sRgbCompanding(linearRgb.r),
      g: sRgbCompanding(linearRgb.g),
      b: sRgbCompanding(linearRgb.b)
    };
  },

  xyzToLab: function(x, y, z) {
    var k = 903.3;
    var e = 0.008856;

    var toF = function(v) {
      return (v > e) ? Math.pow(v, 1/3) : (7.787 * v) + (16 / 116);
    };

    var fx = toF(x);
    var fy = toF(y);
    var fz = toF(z);

    return {
      l: (116 * fy) - 16,
      a: 500 * (fx - fy),
      b: 200 * (fy - fz)
    };
  },

  labToXyz: function(l, a, b) {
    var k = 903.3;
    var e = 0.008856;

    var fy = (l+16)/116;
    var fx = a/500 + fy;
    var fz = fy - b/200;

    return {
      x: (Math.pow(fx, 3) > e) ? Math.pow(fx, 3) : (116*fx-16)/k,
      y: (l > k*e) ? Math.pow((l+16)/116, 3) : l/k,
      z: (Math.pow(fz, 3) > e) ? Math.pow(fz, 3) : (116*fz-16)/k
    };
  },

  labToHcl: function(l, a, b) {
    return {
      h: (180/Math.PI)*Math.atan2(b, a),
      c: Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
      l: l
    };
  },

  hclToLab: function(h, c, l) {
    var hRadians = h*Math.PI/180;
    return {
      l: l,
      a: c*Math.cos(hRadians),
      b: c*Math.sin(hRadians)
    };
  }
};
