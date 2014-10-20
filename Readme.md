procedural.js
=============

Overview
--------

A procedurally generated content library for [WebGL](http://en.wikipedia.org/wiki/WebGL)
and [three.js](http://threejs.org/).

Core:

* Randomness - random distribution utilities (uniform, gaussian, power law)
* Consistent Noise - consistent noise algorithms,  e.g. terrain
* L-Systems - self-similar structures, e.g. trees, plants
* Marching Cubes - meshes from scalar fields, e.g. caves, coral reefs
* Color - coordinated colors, e.g. gradients, palettes
* Skeletons (planned)

Application libraries:

* Trees
* Terrain (Flat, Spherical)
* Water (planned)

Purpose
-------

This project is mainly intended for my own learning and experimentation purposes,  but others are
free to use it.

Design goals
------------

* Provide consistent APIs to core procedural utilities in the style of three.js.

* Composition - Should be easy to build up new applications of procedurally generated content
  by composing the core utilities in this library in new and unique ways.

* Convenient parameterization - allow for some parameters to be constrained to ranges, distributions
  or exact values, with reasonable defaults for unconstrained parameters

* Visual Appeal - Coordinated colors and modern graphics lighting and camera techniques should
  be enabled by default.


Core utilities
==============

Consistent Noise
----------------

Simplex provides a consistent noise source, which can be used to generate random terrain height maps
or animated water height maps.

Pick a random starting coordinate to randomize a surface.

L-System
--------

Generates random trees using a stochastic L-System and renders them using
WebGL and three.js.

Marching Cubes
--------------

Marching cubes can create a mesh from a scalar field.   It has many applications,
and is a powerful tool in the procedural generation toolbox.  It can, for example,
be use to generate complex natural terrain that inclues caves and arches.

Color
-----

Add basic routines, start with: http://blog.noctua-software.com/procedural-colors-for-game.html

Examples
--------

For an example l-system, see examples/trees.html


TODO:

* [ ] Update Gradient generator to use HCL, should better for lerp than RGB
* [ ] Add Markov Chains

* [ ] Fix marching cubes so all parameters can be passed in, have good defaults
* [ ] Add vertex smoothing/removal routine for marching cubes.
* [ ] Generate only a skeleton from l-systems, find a way for them to be skinned in a general way (via vertex shader?)
* [ ] make symbols that can be used in l-systems extensible, so alternatives to the leaf can be added
* [ ] Remove cylinder and sphere shapes (or at least the sphere leaf shape)
      from the l-system code,  introduce a class that can be used in it's place.
      The class should be parametric.
* [ ] non-visual procedural applications, e.g. NPG-AI

Building
========

Setup
-----

Requirements:

* npm
* grunt
* bower

```sh
npm install grunt
npm install bower
npm install grunt --save-dev
```

```sh
npm install
```

Build
-----

```sh
grunt
```

Resulting procedural.js is written to build/procedural.js.

Adding Dependencies
===================

For runtime dependencies:

Warning!  Runtime dependencies should be kept to the absolute minimum.  Please
consider alternatives before proposing an additional dependencies.

```sh
bower install <package> --save
```

For build system dependencies:
```sh
npm install <package> --save-dev
```

Modify package.json.  Make the version of the dependency exact by removing the
"^" prepended to the version.  This eliminates potential build consistency
issues.
