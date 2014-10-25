synthesis.js
=============

Overview
--------

A content synthesis library for [WebGL](http://en.wikipedia.org/wiki/WebGL)
and [three.js](http://threejs.org/).

Core:

* Randomness - random distribution utilities (uniform, gaussian, power law)
* Consistent Noise - consistent noise algorithms,  e.g. terrain, water
* L-Systems - self-similar structures, e.g. trees, plants
* Marching Cubes - meshes from scalar fields, e.g. caves, coral reefs
* Color - coordinated colors, e.g. gradients, palettes
* Mesh Skeletons (planned)

Application libraries:

* Trees
* Terrain (Flat, Spherical)
* Water (planned)

Purpose
-------

This project is mainly intended for my own learning and experimentation purposes,  but others are
free to use it.

The main reason I've put it together is to gather a variety of algorithms and techniques
for generating synthetic content into a single place where I can easily combine them together
to test some concepts I am exploring.

There are a lot of elements of procedurally generated content in this project but it is not intended
as a procedurally generated content toolset in the purest meaning of the term.  In particular,  this
project does not contain utilities to help use a a single random seed to deterministically generate a entire world or
universe.  Some of components of this library could be used toward that end,  but they could just as
easily be used to build content combined with artwork created by hand.

Design goals
------------

* Provide consistent APIs to core utilities, written in the OO style of three.js.

* Composition - Should be easy to build up new applications of synthetic content
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
or surface textures.

Worley provides consistent noise which can be used to represent stone textures, cellular structure,
ridge lines, etc...

For all consistent noise algorithms, results are deterministic.  To add some randomness, one may pick a
random starting coordinate before sampling.

L-Systems
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

* [ ] Clean up Color converter to use classes, add a lerp operation to new HCLColor class
* [ ] Update Gradient generator to use HCL, should better for lerp than RGB
* [ ] Add Markov Chains
* [ ] Fill in "holes" in HCL space, see http://blog.noctua-software.com/procedural-colors-for-game.html for details.

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
bower install
```

Build
-----

```sh
grunt
```

Resulting synthesis.js is written to build/synthesis.js.

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
