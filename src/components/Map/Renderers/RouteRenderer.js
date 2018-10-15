//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import AbstractRenderer from './AbstractRenderer';

export default class RouteRenderer extends AbstractRenderer {
  constructor(esriLoaderContext) {
    super();

    this.esriLoaderContext = esriLoaderContext;

    this.renderer = null; // three.js renderer
    this.camera = null; // three.js camera
    this.scene = null; // three.js scene
    this.vertexIdx = 0;
    this.ambient = null; // three.js ambient light source
    this.nMax = 0;
    this.tick = 0;

    this.geo_curve_path = [
      // should be set by trackcurve !
      [-110.64328314789721, 32.37868835152182, 1900],
      [-110.67697590267913, 32.51583581670097, 1900],
      [-110.70284137541316, 32.479947745911, 1900],
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

    const pts = [];



    //lat longs
    const curve_path = [];

    this.geo_curve_path.forEach(x => {
      let pos = [0, 0, 0];
      externalRenderers.toRenderCoordinates(view, x, 0, SpatialReference.WGS84, pos, 0, 1);
      curve_path.push(new THREE.Vector3(pos[0], pos[1], pos[2])); // we make all coords in global world coord sys !
    });

    const  curve = new THREE.CatmullRomCurve3(curve_path);

    var extrudeSettings = {
      steps: 2000,
      bevelEnabled: false,
      extrudePath: curve
    };

    let squareShape = new THREE.Shape();
    squareShape.moveTo( 0,0 );
    squareShape.lineTo( 0, 120 );
    squareShape.lineTo( 10, 120 );
    squareShape.lineTo( 10, 0);
    squareShape.lineTo( 0, 0 );

    const geometry = new THREE.ExtrudeBufferGeometry( squareShape, extrudeSettings );

    var material = new THREE.MeshPhongMaterial({
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.6,
      color: 0xffdb58,
    })

    this.route = new THREE.Mesh(geometry, material);

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

    this.start();

    // cleanup after ourselfs
    context.resetWebGLState();

  }

  onRequestAnimationFrame(time) {


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
    this.scene.add(this.route);
    this.scene.add(new THREE.AmbientLight(0xeeeeee));
  }
}
