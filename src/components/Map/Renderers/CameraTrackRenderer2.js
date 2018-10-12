//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import AbstractRenderer from './AbstractRenderer';

export default class CameraTrackRenderer2 extends AbstractRenderer {
  constructor(esriLoaderContext) {
    super();

    this.esriLoaderContext = esriLoaderContext;

    this.renderer = null; // three.js renderer
    this.camera = null; // three.js camera
    this.scene = null; // three.js scene
    this.vertexIdx = 0;
    this.ambient = null; // three.js ambient light source




    this.geo = [
      [-110.7395240072906, 32.33625842258334, 1950],
      [-110.7395240072906, 32.33625842258334, 1890],
      [-110.7495240072906, 32.33625842258334, 1850],

    ].map((x) => {
      x[0] = x[0] + 2 * ((Math.random() / 10));
      x[1] = x[1] + 1.5 * ((Math.random() / 10));
      return x;
    });

  }

  /**
   * Setup function, called once
   */
  setup(context) {
    var self = this;

    var externalRenderers = this.esriLoaderContext.externalRenderers;
    var SpatialReference = this.esriLoaderContext.SpatialReference;

    var view = context.view; //this.esriLoaderContext.view;

    const curve_path = [];

    this.geo.forEach(x => {
      let pos = [0, 0, 0];
      externalRenderers.toRenderCoordinates(view, x, 0, SpatialReference.WGS84, pos, 0, 1);
      curve_path.push(new THREE.Vector3(pos[0], pos[1], pos[2])); // we make all coords in global world coord sys !
    });

    let curve = new THREE.CatmullRomCurve3(curve_path);

    var extrudeSettings = {
      steps: 2000,
      bevelEnabled: false,
      extrudePath: curve
    };

    let squareShape = new THREE.Shape();
    squareShape.moveTo( 0,0 );
    squareShape.lineTo( 0, 120 );
    squareShape.lineTo( 20, 120 );
    squareShape.lineTo( 20, 0);
    squareShape.lineTo( 0, 0 );

    const geometry = new THREE.ExtrudeBufferGeometry( squareShape, extrudeSettings );

    this.route = new THREE.Mesh(
      geometry,
      new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      })
    );

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

    // set frame ----------------

    // !  self.route already in world coordinates !

    /*
    const posEst = [
      -110.7395240072906,
      32.32625842258334,
      1500
    ];

    var renderPos = [0, 0, 0];

    //externalRenderers.toRenderCoordinates(view, posEst, 0, SpatialReference.WGS84, renderPos, 0, 1);
    //self.route.position.set(renderPos[0], renderPos[1], renderPos[2]);

    //var transform = new THREE.Matrix4();
    //transform.fromArray(externalRenderers.renderCoordinateTransformAt(view, posEst, SpatialReference.WGS84, new Array(16)));
    //transform.decompose(self.route.position, self.route.quaternion, self.route.scale);

    */
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
    this.scene.add(this.route);
    this.scene.add(new THREE.AmbientLight(0xeeeeee));
  }
}
