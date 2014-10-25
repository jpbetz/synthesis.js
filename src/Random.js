Random = function(seed) {
  this.initialize(seed);
};

Random.prototype = {
  m_w: 123456789,
  m_z: 987654321,
  mask: 0xffffffff,

  initialize: function (seed) {
    this.m_w = seed;
  },

  uniform: function (min, max) {
      return min + (max - min) * this.random();
  },

  poisson: function (mu) {
      var b = 1;
      for (var i = 0; b >= Math.exp(-mu); i++) {
          b *= this.uniform(0, 1);
      }

      return i - 1;
  },

  // Takes any integer
  seed: function (i) {
      m_w = i;
  },

  // from: http://stackoverflow.com/questions/521295/javascript-random-seeds
  // Returns number between 0 (inclusive) and 1.0 (exclusive),
  // just like Math.random().
  random: function() {
    this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
    this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
    var result = ((this.m_z << 16) + this.m_w) & this.mask;
    result /= 4294967296;
    return result + 0.5;
  }
};
