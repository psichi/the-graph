Fork Information [![Build Status](https://secure.travis-ci.org/psichi/the-graph.png?branch=master)](http://travis-ci.org/psichi/the-graph) [![MIT license](http://img.shields.io/badge/License-MIT-brightgreen.svg)](#license)
================

This fork is a conversion of the codebase of the-graph to the latest react and es6.

The dependency on Polymer is removed, yet the api should be compatible enough to be integrated within
the current polymer components of the graph.

The dependency on bower has also been removed.

The components are build using webpack.

Visit https://psichi.github.io/the-graph/ to see the current status. 

## The Graph Editor

This project provides a set of React Components for viewing and editing flow-based programming graphs.

The focus is on performance, usage of modern web technologies, and touchscreen friendliness.

The graph widgets have the following dependencies:

* [React](http://facebook.github.io/react/) for the "virtual DOM" to make SVG fast
* [KLay Layered](http://rtsys.informatik.uni-kiel.de/confluence/display/KIELER/KLay+Layered) graph autolayout via [KLayJS](https://github.com/automata/klay-js)

The project is the graph editing tool in [NoFlo UI](https://github.com/noflo/noflo-ui), replacing the older [dataflow](https://github.com/meemoo/dataflow) graph editor.

## Installation

Get dependencies and build:

    npm install
    npm run build

## Running

    npm start

And open http://localhost:3000/the-graph-editor/index.html

## Storybook

    npm run storybook 


## License

[The MIT License](./LICENSE-MIT.txt)
