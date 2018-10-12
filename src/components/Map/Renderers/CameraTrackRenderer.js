//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import AbstractRenderer from './AbstractRenderer';

export default class CameraTrackRenderer extends AbstractRenderer {
  constructor(esriLoaderContext) {
    super();

    this.esriLoaderContext = esriLoaderContext;

    this.renderer = null; // three.js renderer
    this.camera = null; // three.js camera
    this.scene = null; // three.js scene
    this.vertexIdx = 0;
    this.ambient = null; // three.js ambient light source

    this.geo = [
      [-110.7395240072906, 32.33625842258334, 2500],
      [-110.7495240072906, 32.33625842258334, 2500],
      [-110.7495240072906, 32.37625842258334, 2500],
    ];
  }

  /**
   * Setup function, called once
   */
  setup(context) {
    var self = this;

    var externalRenderers = this.esriLoaderContext.externalRenderers;
    var SpatialReference = this.esriLoaderContext.SpatialReference;
    var view = context.view; //this.esriLoaderContext.view;

    // initialize the three.js renderer
    //////////////////////////////////////////////////////////////////////////////////////
    this.renderer = new THREE.WebGLRenderer({
      context: context.gl,
      //premultipliedAlpha: false
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(context.camera.fullWidth, context.camera.fullHeight);

    // prevent three.js from clearing the buffers provided by the ArcGIS JS API.
    this.renderer.autoClear = false;
    this.renderer.autoClearDepth = false;
    this.renderer.autoClearStencil = false;
    this.renderer.autoClearColor = false;

    // The ArcGIS JS API renders to custom offscreen buffers, and not to the default framebuffers.
    // We have to inject this bit of code into the three.js runtime in order for it to bind those
    // buffers instead of the default ones.

    var originalSetRenderTarget = this.renderer.setRenderTarget.bind(this.renderer);

    this.renderer.setRenderTarget = function(target) {
      originalSetRenderTarget(target);
      if (target == null) {
        context.bindRenderTarget();
      }
    };

    ///////////////////////////////////////////////////////////////////////////////////////

    self.scene = new THREE.Scene();

    // setup the camera
    var cam = context.camera;
    this.camera = new THREE.PerspectiveCamera(cam.fovY, cam.aspect, cam.near, cam.far);
    this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
    this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
    this.camera.lookAt(new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]));
    // Projection matrix can be copied directly
    this.camera.projectionMatrix.fromArray(cam.projectionMatrix);

    const thing = [];

    this.geo.forEach(x => {
      let pos = [0, 0, 0];
      externalRenderers.toRenderCoordinates(view, x, 0, SpatialReference.WGS84, pos, 0, 1);
      thing.push(new THREE.Vector3(pos[0], pos[1], pos[2]));
    });

    var curve = new THREE.CatmullRomCurve3(thing);

    // Set up settings for later extrusion
    var extrudeSettings = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: false,
    };

    //Define a triangle
    var pts = [],
      count = 3;
    for (var i = 0; i < count; i++) {
      var l = 20;
      var a = ((2 * i) / count) * Math.PI;
      pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
    }
    var shape = new THREE.Shape(pts);

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var material = new THREE.MeshLambertMaterial({ color: 0xb00000, wireframe: false });

    this.mesh = new THREE.Mesh(geometry, material);

    this.start();

    // cleanup after ourselfs
    context.resetWebGLState();
  }

  onRequestAnimationFrame(time) {
    //nothing to animate route
    // wrote you code that update object on requestAnimationFrame
    // because it will be much smooth that in render callback
  }

  onSwipe(isLeft, event) {}

  render(context) {
    var externalRenderers = this.esriLoaderContext.externalRenderers;
    var SpatialReference = this.esriLoaderContext.SpatialReference;

    var view = context.view; //this.esriLoaderContext.view;

    // update camera parameters
    ///////////////////////////////////////////////////////////////////////////////////
    var cam = context.camera;
    this.camera = new THREE.PerspectiveCamera(cam.fov, cam.aspect, cam.near, cam.far);
    this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
    this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
    this.camera.lookAt(new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]));
    // Projection matrix can be copied directly
    this.camera.projectionMatrix.fromArray(cam.projectionMatrix);

    // draw the scene
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    this.renderer.state.reset();

    this.renderer.state.setBlending(THREE.NoBlending); // 0.97 fix !

    this.renderer.render(this.scene, this.camera);

    // externalRenderers.requestRender(view); - this is bad practice - endless recursion
    //
    // check the MapHolder - animation frame

    // cleanup
    context.resetWebGLState();
  }

  start() {
    this.scene.add(this.track);
    this.scene.add(this.mesh);
    //this.scene.add(this.ball);
    this.scene.add(new THREE.AmbientLight(0xeeeeee));
  }
}
