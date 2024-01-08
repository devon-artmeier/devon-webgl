# Devon's WebGL TypeScript Framework

This is a framework for WebGL that I wrote in TypeScript for use with my personal projects.

## Supported features

* GLSL shaders
* 2D textures
  * Image loading
  * Use as framebuffer/render target
* Meshes with support for custom vertex formats
  * Can be defined as static or dynamic. Dynamic models can have their data modified.
* Generators for projection, view, and model matrices
* Viewport
* Blending
* Scissor testing
* Depth testing
* Stencil testing
* Culling
* Fullscreen
* Canvas resizing

## Planned features

* Texture modification functions
* Cubemaps
* Multiple viewports

## Installation

    npm install devon-webgl-ts

## Building locally

    git clone https://github.com/devon-artmeier/devon-webgl.git
    npm install
    npm run build
