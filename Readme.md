Procedurally Generated Content for WebGL
========================================

A procedurally generated content library for WebGL and three.js.

Core libraries:

* Noise - TODO! for consistent noise generation,  e.g. terrain
* L-System - self-similar structures, e.g. plants
* Color - TODO! for generating coordinated color points, e.g. gradients, palettes

Features:
* All generation is parametric, allowing for desired parameters to be constrained
  by the caller

Noise
-------

TODO: add simplex

L-System
--------

Generates random trees using a stochastic L-System and renders them using
WebGL and three.js.

Color
-----

Add basic routines, start with: http://blog.noctua-software.com/procedural-colors-for-game.html

Examples
--------

For an example l-system, see examples/trees.html


TODO:

* [ ] Generate only a skeleton from l-systems, find a way for them to be skinned in a general way
* [ ] make symbols that can be used in l-systems extensible, so alternatives to the leaf can be added
* [ ] Remove cylinder and sphere shapes (or at least the sphere leaf shape)
      from the l-system code,  introduce a class that can be used in it's place.
      The class should be parametric.
* [ ] Build noise material geneartor, support linear and spherical systems
