procedural.js
=============

A procedurally generated content library for [WebGL](http://en.wikipedia.org/wiki/WebGL)
and [three.js](http://threejs.org/).

Core:

* Random - random distribution utilities
* Noise - consistent noise generation,  e.g. terrain
* L-System - self-similar structures, e.g. trees, plants
* Color - coordinated colors, e.g. gradients, palettes
* Skeletons (planned)

Materials:

* Procedural Noise materials
* Procedural Color materials

Animations:

(planned)

Application libraries:

* Trees
* Terrain (Flat, Spherical)
* Water

Features:
* All generation is parametric, allowing for desired parameters to be constrained
  by the caller

Purpose
-------

Applications of procedurally generated content tend to use a fairly small but
flexible set of core utilities.

Many applications of procedurally generated content use a combination of
hand authored artwork, rules and mechanics in combination with generated content.

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

* [ ] Add cubemap noise texture support
* [ ] Generate only a skeleton from l-systems, find a way for them to be skinned in a general way
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
