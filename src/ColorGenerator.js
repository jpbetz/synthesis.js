ColorGenerator = function() {

};

ColorGenerator.prototype = {
  converter: new ColorConverter(),

  randomColor: function(parameters) {
    parameters = parameters || {};
    var h = parameters.h !== undefined ? parameters.h : Math.random()*360;
    var c = parameters.c !== undefined ? parameters.c : 20*Math.random()*20;
    var l = parameters.l !== undefined ? parameters.l : 40*Math.random()*30;

    var rgb = this.converter.hclToRgb(h, c, l);
    return new THREE.Color(rgb.r, rgb.g, rgb.b);
  },

  modifyH: function(color, modifierFunction) {
    var hcl = converter.rgbToHcl(color.r, color.g, color.b);
    var h = modifierFunction(hcl.h);
    var c = hcl.c;
    var l = hcl.l;
    var rgb = this.converter.hclToRgb(h, c, l);
    return new THREE.Color(rgb.r, rgb.g, rgb.b);
  },

  pickComplementaryColor: function(color) {
    return this.modifyH(color, function(h) { return h + 180 % 360; });
  },

  pickAnalogousColors: function(color) {
    var offset = 30;
    return [
      this.modifyH(color, function(h) { return h + offset % 360; }),
      this.modifyH(color, function(h) { return h - offset % 360; })
    ];
  },

  pickSplitComplementaryColors: function(color) {
    var offset = 30;
    return [
      this.modifyH(color, function(h) { return h + 180 + offset % 360; }),
      this.modifyH(color, function(h) { return h + 180 - offset % 360; })
    ];
  },

  pickTriadColors: function(color) {
    return [
      this.modifyH(color, function(h) { return h + 240 % 360; }),
      this.modifyH(color, function(h) { return h + 120 % 360; })
    ];
  },

  pickTetradicColors: function(color) {
    return [
      this.modifyH(color, function(h) { return h + 30 % 360; }),
      this.modifyH(color, function(h) { return h + 180 % 360; }),
      this.modifyH(color, function(h) { return h + 210 % 360; })
    ];
  },

  pickSquareColors: function() {
    return [
      this.modifyH(color, function(h) { return h + 90 % 360; }),
      this.modifyH(color, function(h) { return h + 180 % 360; }),
      this.modifyH(color, function(h) { return h - 90 % 360; })
    ];
  }
};
